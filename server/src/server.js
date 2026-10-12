import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { uploadDir } from './middleware/upload.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import landingRoutes from './routes/landingRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import { loadBlocklist } from './middleware/blocklist.js';

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing JWT_SECRET or MONGO_URI. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();

// Behind a reverse proxy (Nginx, Render, etc.)
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Allowed origins configured for local development and Vercel production
const allowedOrigins = [
  'https://muthoy-bazar-e-commerce-ojqg.vercel.app',
  'https://muthoy-bazar-e-commerce.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Combine origins from environment variable if provided
if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);
  envOrigins.forEach((url) => {
    if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
  });
}

// Dynamic CORS origin handler
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('localhost')) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback: allow all during testing
    },
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/settings', settingRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

// Start listening immediately so Render doesn't throw 502 Bad Gateway
app.listen(port, () => {
  console.log(`API running on port ${port}`);

  // Connect DB after server starts
  connectDB()
    .then(() => loadBlocklist())
    .then(() => console.log('MongoDB and Blocklist loaded successfully.'))
    .catch((e) => console.error('Database connection failed:', e.message));
});