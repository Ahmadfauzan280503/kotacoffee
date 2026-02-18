const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get cart items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*, category:categories(*), unit:units(*))
      `)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get cart items' 
      });
    }

    const mappedCartItems = cartItems.map(item => ({
      ...item,
      product: item.product ? {
        ...item.product,
        imageUrl: item.product.image_url
      } : null
    }));

    res.json({ 
      success: true, 
      data: mappedCartItems 
    });
  } catch (error) {
    console.error('[cart.routes.js:GET /] error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + (quantity || 1) })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products(*)
        `)
        .maybeSingle();

      if (error) {
        console.error('[cart.routes.js:POST /] Update error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update cart quantity' 
        });
      }

      if (!updatedItem) {
        return res.status(404).json({ 
          success: false, 
          message: 'Cart item disappeared during update' 
        });
      }

      return res.json({ 
        success: true, 
        data: {
          ...updatedItem,
          product: updatedItem.product ? {
            ...updatedItem.product,
            imageUrl: updatedItem.product.image_url
          } : null
        }
      });
    }

    // Add new item
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: req.user.id,
        product_id: productId,
        quantity: quantity || 1
      })
      .select(`
        *,
        product:products(*)
      `)
      .maybeSingle();

    if (error) {
      console.error('[cart.routes.js:POST /] Insert error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to add to cart' 
      });
    }

    res.status(201).json({ 
      success: true, 
      data: {
        ...cartItem,
        product: cartItem.product ? {
          ...cartItem.product,
          imageUrl: cartItem.product.image_url
        } : null
      }
    });
  } catch (error) {
    console.error('[cart.routes.js:POST /] error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Update cart item quantity
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      return res.json({ 
        success: true, 
        message: 'Item removed from cart' 
      });
    }

    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update cart item' 
      });
    }

    res.json({ 
      success: true, 
      data: cartItem 
    });
  } catch (error) {
    console.error('[cart.routes.js:PUT /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Remove from cart
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to remove from cart' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Item removed from cart' 
    });
  } catch (error) {
    console.error('[cart.routes.js:DELETE /:id] error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Increase quantity
router.put('/increase', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item ID is required' 
      });
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!existingItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', itemId)
      .select(`
        *,
        product:products(*)
      `)
      .maybeSingle();

    if (error) {
      console.error('[cart.routes.js:PUT /increase] Update error:', error);
      console.dir(error, { depth: null });
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update cart' 
      });
    }

    if (!updatedItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found after update' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        ...updatedItem,
        product: updatedItem.product ? {
          ...updatedItem.product,
          imageUrl: updatedItem.product.image_url
        } : null
      }
    });
  } catch (error) {
    console.error('[cart.routes.js:PUT /increase] error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Decrease quantity
router.put('/decrease', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item ID is required' 
      });
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (!existingItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    if (existingItem.quantity <= 1) {
      // Remove item if quantity is 1
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', req.user.id);

      if (error) {
        console.error('[cart.routes.js:PUT /decrease] Delete error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to remove item' 
        });
      }

      return res.json({ 
        success: true, 
        message: 'Item removed from cart' 
      });
    }

    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity - 1 })
      .eq('id', itemId)
      .select(`
        *,
        product:products(*)
      `)
      .maybeSingle();

    if (error) {
      console.error('[cart.routes.js:PUT /decrease] Update error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update cart' 
      });
    }

    if (!updatedItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found after update' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        ...updatedItem,
        product: updatedItem.product ? {
          ...updatedItem.product,
          imageUrl: updatedItem.product.image_url
        } : null
      }
    });
  } catch (error) {
    console.error('[cart.routes.js:PUT /decrease] error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to clear cart' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    console.error('[cart.routes.js:DELETE /] error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
