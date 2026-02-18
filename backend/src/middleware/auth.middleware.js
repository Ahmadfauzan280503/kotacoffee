const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with explicit options for security
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    if (!decoded || !decoded.id) {
       return res.status(401).json({ 
        success: false, 
        message: 'Invalid token payload' 
      });
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, username, photo_url, phone, address, created_at')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication failed' 
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ 
      success: false, 
      message: message
    });
  }
};

// Admin only middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Seller middleware
const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Seller access required' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
