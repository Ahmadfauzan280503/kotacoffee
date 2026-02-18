const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, sellerMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get featured products (public)
router.get('/featured', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        unit:units(*),
        seller:sellers(*, user:users(name))
      `)
      .eq('is_featured', true)
      .limit(8);

    if (error) {
      console.error('[product.routes.js:GET /featured (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get featured products' 
      });
    }

    const mappedProducts = products.map(p => ({
      ...p,
      imageUrl: p.image_url
    }));

    res.json({ 
      success: true, 
      data: mappedProducts 
    });
  } catch (error) {
    console.error('[product.routes.js:GET /featured (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all products with filters (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 8 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        unit:units(*),
        seller:sellers(*, user:users(name))
      `, { count: 'exact' });

    if (category && category !== 'null' && category !== 'undefined') {
      query = query.eq('category_id', category);
    }

    if (search && search !== 'null' && search !== 'undefined') {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: products, count, error } = await query;

    if (error) {
      console.error('[product.routes.js:GET / (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get products' 
      });
    }

    const mappedProducts = products.map(p => ({
      ...p,
      imageUrl: p.image_url
    }));

    res.json({ 
      success: true, 
      data: {
        products: mappedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[product.routes.js:GET / (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        unit:units(*),
        seller:sellers(*, user:users(name))
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const mappedProduct = {
      ...product,
      imageUrl: product.image_url
    };

    res.json({ 
      success: true, 
      data: mappedProduct 
    });
  } catch (error) {
    console.error('[product.routes.js:GET /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create product (seller only)
router.post('/', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { name, price, stock, unitId, categoryId, description, imageUrl, isFeatured } = req.body;

    // Get seller ID
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!seller) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seller profile not found' 
      });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        price,
        stock,
        unit_id: unitId,
        category_id: categoryId,
        description,
        image_url: imageUrl,
        seller_id: seller.id,
        is_featured: isFeatured || false
      })
      .select(`
        *,
        category:categories(*),
        unit:units(*)
      `)
      .single();

    if (error) {
      console.error('[product.routes.js:POST / (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create product' 
      });
    }

    res.status(201).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('[product.routes.js:POST / (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update product (seller only)
router.put('/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, unitId, categoryId, description, imageUrl, isFeatured } = req.body;

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        price,
        stock,
        unit_id: unitId,
        category_id: categoryId,
        description,
        image_url: imageUrl,
        is_featured: isFeatured !== undefined ? isFeatured : undefined,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[product.routes.js:PUT /:id (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update product' 
      });
    }

    res.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('[product.routes.js:PUT /:id (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Delete product (seller)
router.delete('/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[product.routes.js:DELETE /:id (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete product' 
      });
    }

    res.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('[product.routes.js:DELETE /:id (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Admin delete product
router.delete('/admin/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete product' 
      });
    }

    res.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('[product.routes.js:DELETE /admin/:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
