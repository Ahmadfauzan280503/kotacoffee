const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get seller profile (by current user)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: seller, error } = await supabase
      .from('sellers')
      .select(`
        *,
        products:products(*)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error || !seller) {
      return res.status(404).json({ 
        success: false, 
        message: 'Seller profile not found' 
      });
    }

    const mappedSeller = {
      ...seller,
      storeName: seller.shop_name,
      storeLocation: seller.address,
      verified: seller.is_verified,
      products: seller.products ? seller.products.map(p => ({
        ...p,
        imageUrl: p.image_url
      })) : []
    };

    res.json({ 
      success: true, 
      data: mappedSeller 
    });
  } catch (error) {
    console.error('[seller.routes.js:GET /me] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all sellers (admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('sellers')
      .select(`
        *,
        user:users(name, email)
      `, { count: 'exact' });

    if (search && search !== 'null') {
      query = query.ilike('shop_name', `%${search}%`);
    }

    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: sellers, count, error } = await query;

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get sellers' 
      });
    }

    const mappedSellers = sellers.map(s => ({
      ...s,
      storeName: s.shop_name,
      storeLocation: s.address,
      verified: s.is_verified
    }));

    res.json({ 
      success: true, 
      data: {
        sellers: mappedSellers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[seller.routes.js:GET /] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get seller by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: seller, error } = await supabase
      .from('sellers')
      .select(`
        *,
        user:users(name, email),
        products:products(*)
      `)
      .eq('id', id)
      .single();

    if (error || !seller) {
      return res.status(404).json({ 
        success: false, 
        message: 'Seller not found' 
      });
    }

    const mappedSeller = {
      ...seller,
      storeName: seller.shop_name,
      storeLocation: seller.address,
      verified: seller.is_verified,
      products: seller.products ? seller.products.map(p => ({
        ...p,
        imageUrl: p.image_url
      })) : []
    };

    res.json({ 
      success: true, 
      data: mappedSeller 
    });
  } catch (error) {
    console.error('[seller.routes.js:GET /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create seller (become a seller)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shopName, description, address, phone } = req.body;

    // Check if user is already a seller
    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (existingSeller) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already registered as a seller' 
      });
    }

    // Create seller profile
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert({
        user_id: req.user.id,
        shop_name: shopName,
        description,
        address,
        phone,
        is_verified: false
      })
      .select()
      .single();

    if (sellerError) {
      console.error('[seller.routes.js:POST / (supabase)] error:', sellerError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create seller profile' 
      });
    }

    // Update user role to seller
    await supabase
      .from('users')
      .update({ role: 'seller' })
      .eq('id', req.user.id);

    const mappedSeller = {
      ...seller,
      storeName: seller.shop_name,
      storeLocation: seller.address,
      verified: seller.is_verified
    };

    res.status(201).json({ 
      success: true, 
      data: mappedSeller,
      message: 'Seller profile created successfully' 
    });
  } catch (error) {
    console.error('[seller.routes.js:POST / (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update seller profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { shopName, description, address, phone } = req.body;

    const { data: seller, error } = await supabase
      .from('sellers')
      .update({
        shop_name: shopName,
        description,
        address,
        phone,
        updated_at: new Date()
      })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update seller profile' 
      });
    }

    const mappedSeller = {
      ...seller,
      storeName: seller.shop_name,
      storeLocation: seller.address,
      verified: seller.is_verified
    };

    res.json({ 
      success: true, 
      data: mappedSeller 
    });
  } catch (error) {
    console.error('[seller.routes.js:PUT /update] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify seller (admin only)
router.put('/verify/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: seller, error } = await supabase
      .from('sellers')
      .update({ is_verified: true, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to verify seller' 
      });
    }

    res.json({ 
      success: true, 
      data: seller,
      message: 'Seller verified successfully' 
    });
  } catch (error) {
    console.error('[seller.routes.js:PUT /verify/:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Delete seller (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Get seller to find user_id
    const { data: seller } = await supabase
      .from('sellers')
      .select('user_id')
      .eq('id', id)
      .single();

    // Delete seller
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete seller' 
      });
    }

    // Update user role back to user
    if (seller) {
      await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('id', seller.user_id);
    }

    res.json({ 
      success: true, 
      message: 'Seller deleted successfully' 
    });
  } catch (error) {
    console.error('[seller.routes.js:DELETE /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
