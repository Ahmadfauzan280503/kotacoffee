const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get user orders
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*, product:products(*))
      `, { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'null') {
      query = query.eq('status', status);
    }

    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: orders, count, error } = await query;

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get orders' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[order.routes.js:GET /user] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get seller orders
router.get('/seller', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 1. Get seller id for current user
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (sellerError || !seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    // 2. Get orders that contain items from this seller
    // This is a bit complex in Supabase JS, so we fetch items first or use joins if possible
    // For simplicity and since we need counts, let's fetch orders that have items belonging to the seller
    let query = supabase
      .from('order_items')
      .select(`
        order:orders(
          *,
          user:users(name, email, phone, address),
          items:order_items(*, product:products(*))
        )
      `, { count: 'exact' })
      .eq('product.seller_id', seller.id)
      .order('created_at', { ascending: false, foreignTable: 'orders' });

    if (status && status !== 'null') {
      query = query.eq('order.status', status);
    }

    // Supabase JS library handles joins and counts differently. 
    // Let's use a simpler query: get all order_items for seller products, then get unique orders.
    // Or even better, just query orders and filter by their items' seller_id if Supabase allows nested filters.
    
    // Fallback: fetch orders and filter in JS if the range query is problematic, 
    // but better to do it via supabase.
    const { data: items, count, error } = await supabase
      .from('order_items')
      .select('order_id, product:products!inner(seller_id)')
      .eq('product.seller_id', seller.id);

    if (error) {
        return res.status(500).json({ success: false, message: 'Error fetching seller items' });
    }

    const orderIds = [...new Set(items.map(i => i.order_id))];

    if (orderIds.length === 0) {
        return res.json({ success: true, data: { orders: [], pagination: { total: 0 } } });
    }

    let orderQuery = supabase
        .from('orders')
        .select(`
            *,
            user:users(name, email, phone),
            items:order_items(*, product:products(*))
        `, { count: 'exact' })
        .in('id', orderIds)
        .order('created_at', { ascending: false });

    if (status && status !== 'null') {
        orderQuery = orderQuery.eq('status', status);
    }

    orderQuery = orderQuery.range(offset, offset + parseInt(limit) - 1);

    const { data: orders, count: totalCount, error: orderError } = await orderQuery;

    if (orderError) {
        return res.status(500).json({ success: false, message: 'Error fetching seller orders' });
    }

    res.json({ 
      success: true, 
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[order.routes.js:GET /seller] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all orders (admin)
router.get('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(name, email, phone),
        items:order_items(*, product:products(*))
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'null') {
      query = query.eq('status', status);
    }

    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: orders, count, error } = await query;

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get orders' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[order.routes.js:GET /admin] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(name, email, phone, address),
        items:order_items(*, product:products(*))
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user owns this order or is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({ 
      success: true, 
      data: order 
    });
  } catch (error) {
    console.error('[order.routes.js:GET /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create order (checkout)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', req.user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('[order.routes.js:POST / (order supabase)] error:', orderError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create order' 
      });
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[order.routes.js:POST / (items supabase)] error:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create order items' 
      });
    }

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    // Get complete order with items
    const { data: completeOrder } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*, product:products(*))
      `)
      .eq('id', order.id)
      .single();

    res.status(201).json({ 
      success: true, 
      data: completeOrder,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('[order.routes.js:POST / (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update order status' 
      });
    }

    // Log wallet transaction if status is paid or completed
    if (status === 'paid' || status === 'completed') {
      await supabase.from('wallet_transactions').insert({
        user_id: order.user_id,
        amount: order.total_amount || 0,
        type: 'payment',
        status: 'success',
        description: `Pembayaran/Penyelesaian pesanan #${order.id.slice(0, 8)}`,
        order_id: order.id,
        created_at: new Date()
      });
    }

    res.json({ 
      success: true, 
      data: order 
    });
  } catch (error) {
    console.error('[order.routes.js:PUT /status/:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update status to processing
router.put('/process/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'processing', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to update status' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update status to delivered
router.put('/delivered/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'delivered', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to update status' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update status to completed
router.put('/completed/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'completed', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to update status' });

    // Log wallet transaction
    await supabase.from('wallet_transactions').insert({
      user_id: order.user_id,
      amount: order.total_amount || 0,
      type: 'payment',
      status: 'success',
      description: `Penyelesaian pesanan #${order.id.slice(0, 8)}`,
      order_id: order.id,
      created_at: new Date()
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Cancel order (user)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending orders can be cancelled' 
      });
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to cancel order' 
      });
    }

    res.json({ 
      success: true, 
      data: updatedOrder,
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    console.error('[order.routes.js:PUT /cancel/:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Delete order (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Only allow deleting cancelled or completed orders
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!['cancelled', 'completed', 'failed'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only cancelled, completed, or failed orders can be deleted' 
      });
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[order.routes.js:DELETE /:id] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete order' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    console.error('[order.routes.js:DELETE /:id] catch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
