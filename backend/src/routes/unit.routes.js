const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all units
router.get('/', async (req, res) => {
  try {
    const { data: units, error } = await supabase
      .from('units')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get units' 
      });
    }

    res.json({ 
      success: true, 
      data: units 
    });
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create unit (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, symbol } = req.body;

    const { data: unit, error } = await supabase
      .from('units')
      .insert({ name, symbol })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create unit' 
      });
    }

    res.status(201).json({ 
      success: true, 
      data: unit 
    });
  } catch (error) {
    console.error('Create unit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update unit (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, symbol } = req.body;

    const { data: unit, error } = await supabase
      .from('units')
      .update({ name, symbol })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update unit' 
      });
    }

    res.json({ 
      success: true, 
      data: unit 
    });
  } catch (error) {
    console.error('Update unit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Delete unit (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete unit' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Unit deleted successfully' 
    });
  } catch (error) {
    console.error('Delete unit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
