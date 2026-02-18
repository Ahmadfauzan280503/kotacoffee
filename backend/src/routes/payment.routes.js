const express = require('express');
const router = express.Router();
const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');
const { authMiddleware } = require('../middleware/auth.middleware');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: (...args) => fetch(args[0], { ...args[1], keepalive: false })
    }
  }
);

// Create Snap Token
router.post('/midtrans/token', authMiddleware, async (req, res) => {
  try {
    const { orderId, amount, items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: orderId || `ORDER-${Date.now()}-${req.user.id.slice(0, 5)}`,
        gross_amount: Math.round(amount)
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email
      },
      item_details: items || []
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      success: true,
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url
      }
    });
  } catch (error) {
    console.error('[payment.routes.js:POST /midtrans/token] error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment token',
      error: error.message
    });
  }
});

// Midtrans Notification Handler
router.post('/notification', async (req, res) => {
  try {
    const apiClient = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Verification step
    const statusResponse = await apiClient.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const statusCode = statusResponse.status_code;
    const grossAmount = statusResponse.gross_amount;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const signatureKey = statusResponse.signature_key;

    // Verify Signature Key
    // signature_key = hash(order_id + status_code + gross_amount + server_key)
    const crypto = require('crypto');
    const hash = crypto.createHash('sha512')
      .update(orderId + statusCode + grossAmount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');

    if (hash !== signatureKey) {
      console.error('[payment.routes.js:POST /notification] Invalid signature detected!');
      return res.status(403).json({ success: false, message: 'Invalid signature key' });
    }

    console.log(`Verified transaction notification. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    let orderStatus = 'pending';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        orderStatus = 'pending';
      } else if (fraudStatus == 'accept') {
        orderStatus = 'paid';
      }
    } else if (transactionStatus == 'settlement') {
      orderStatus = 'paid';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      orderStatus = 'failed';
    } else if (transactionStatus == 'pending') {
      orderStatus = 'pending';
    }

    // Update order status in Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: orderStatus, updated_at: new Date() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('[payment.routes.js:POST /notification] Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update order status' });
    }

    // Log wallet transaction if paid
    if (orderStatus === 'paid') {
      await supabase.from('wallet_transactions').insert({
        user_id: order.user_id,
        amount: order.total_amount || 0,
        type: 'payment',
        status: 'success',
        description: `Pembayaran pesanan #${order.id.slice(0, 8)} (via Midtrans)`,
        order_id: order.id,
        created_at: new Date()
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[payment.routes.js:POST /notification] catch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
