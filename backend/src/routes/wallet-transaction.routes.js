const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route GET /wallet/transaction/superadmin
 * @desc Get all wallet transactions (Admin only)
 */
router.get('/superadmin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('wallet_transactions')
      .select(`
        *,
        user:users(name, email),
        order:orders(id, total_amount)
      `, { count: 'exact' });

    if (search && search.trim() !== '') {
      query = query.ilike('description', `%${search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    const { data: transactions, count, error } = await query;

    if (error) {
      console.error('[wallet-transaction.routes.js:GET /superadmin] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch transactions' 
      });
    }

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('[wallet-transaction.routes.js:GET /superadmin] catch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

/**
 * @route GET /wallet/transaction
 * @desc Get current user's wallet transactions
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch transactions' 
      });
    }

    res.json({ 
      success: true, 
      data: transactions 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

/**
 * @route POST /wallet/transaction
 * @desc Create a new wallet transaction (e.g., for deposit or manual entry)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, status, description, order_id } = req.body;

    const { data: transaction, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: req.user.id,
        amount,
        type: type || 'payment',
        status: status || 'pending',
        description,
        order_id,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) {
      console.error('[wallet-transaction.routes.js:POST /] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create transaction' 
      });
    }

    res.status(201).json({ 
      success: true, 
      data: transaction 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
