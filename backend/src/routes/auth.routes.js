const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');

const { z } = require('zod');
const validate = require('../middleware/validation.middleware');

const router = express.Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    username: z.string().min(3).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

// Register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and name are required' 
      });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        username: username || email.split('@')[0],
        role: 'user'
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create user' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true, 
      data: token,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      data: token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Social Login (Google)
router.post('/login/google', async (req, res) => {
  try {
    const { email, name, photoUrl } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if user exists
    let { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Google login fetch error:', fetchError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (!user) {
      // Create new user if doesn't exist
      let username = email.split('@')[0];
      
      // Check for username conflict
      const { data: existingUsername } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUsername) {
        // Simple strategy: append random string if username exists
        username = `${username}_${Math.random().toString(36).substring(2, 7)}`;
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password: 'GOOGLE_SOCIAL_AUTH', 
          name: name || username,
          photo_url: photoUrl,
          username: username,
          role: email === 'ahmadfauzan280503@gmail.com' ? 'admin' : 'user',
          updated_at: new Date()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Google login insert error:', insertError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create user' 
        });
      }
      user = newUser;
    } else {
      // User exists, update photo and name if they are empty
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          photo_url: user.photo_url || photoUrl,
          name: user.name || name,
          updated_at: new Date()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (!updateError) {
        user = updatedUser;
      }
    }

    // Generate internal token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      data: token 
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { password, ...userData } = req.user;
    res.json({ 
      success: true, 
      data: userData 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update user
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { name, username, phone, address } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, username, phone, address, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update user' 
      });
    }

    const { password, ...userData } = user;
    res.json({ 
      success: true, 
      data: userData 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update photo
router.put('/update-photo', authMiddleware, async (req, res) => {
  try {
    const { photoUrl } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ photo_url: photoUrl, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update photo' 
      });
    }

    res.json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, req.user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from('users')
      .update({ password: hashedPassword, updated_at: new Date() })
      .eq('id', req.user.id);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to change password' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Activation (placeholder)
router.post('/activation', async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Account activated' 
  });
});

module.exports = router;
