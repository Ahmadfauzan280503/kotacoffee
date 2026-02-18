const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const sellerRoutes = require('./routes/seller.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const mediaRoutes = require('./routes/media.routes');
const unitRoutes = require('./routes/unit.routes');
const walletRoutes = require('./routes/wallet-transaction.routes');
const paymentRoutes = require('./routes/payment.routes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet()); // Set various security HTTP headers

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use(limiter);

// Auth Rate Limiting (Stricter)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 attempts per hour
  message: {
    success: false,
    message: 'Too many login/register attempts, please try again after an hour'
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Specific limter for auth
app.use('/auth', authLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/seller', sellerRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/media', mediaRoutes);
app.use('/unit', unitRoutes);
app.use('/wallet/transaction', walletRoutes);
app.use('/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} [HEARTBEAT]`);
});
