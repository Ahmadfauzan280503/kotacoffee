const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all categories (public - for landing page)
router.get('/', async (req, res) => {
  try {
    const { search, page, limit } = req.query;

    let query = supabase
      .from('categories')
      .select(`
        *,
        products:products(id)
      `, { count: 'exact' });

    if (search && search !== 'null' && search !== 'undefined') {
      query = query.ilike('name', `%${search}%`);
    }

    if (page && limit && page !== 'null' && limit !== 'null') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      query = query.range(offset, offset + parseInt(limit) - 1);
    }

    const { data: categories, count, error } = await query;

    if (error) {
      console.error('Get categories error [v2]:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get categories' 
      });
    }

    // Map image_url to imageUrl for frontend consistency
    const mappedCategories = categories.map(cat => ({
      ...cat,
      imageUrl: cat.image_url
    }));

    // If has pagination params return with pagination
    if (page && limit && page !== 'null' && limit !== 'null') {
      res.json({ 
        success: true, 
        data: {
          categories: mappedCategories,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } else {
      // For landing page, just return categories array
      res.json({ 
        success: true, 
        data: {
          categories: mappedCategories
        }
      });
    }
  } catch (error) {
    console.error('[category.routes.js:GET /] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        products:products(*)
      `)
      .eq('id', id)
      .single();

    if (error || !category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    res.json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('[category.routes.js:GET /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create category (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error('[category.routes.js:POST / (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create category' 
      });
    }

    res.status(201).json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('[category.routes.js:POST / (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update category (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name,
        image_url: imageUrl,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[category.routes.js:PUT /:id (supabase)] error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update category' 
      });
    }

    res.json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('[category.routes.js:PUT /:id (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Delete category (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('[category.routes.js:DELETE /:id (supabase)] error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete category' 
      });
    }

    if (!category || category.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or already deleted'
      });
    }

    res.json({ 
      success: true, 
      data: category[0] 
    });
  } catch (error) {
    console.error('[category.routes.js:DELETE /:id (catch)] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
