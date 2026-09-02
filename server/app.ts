import express from 'express';
import cors from 'cors';
import path from 'path';
import { productRouter } from './routes/productRoutes';
import { authRouter } from './routes/authRoutes';
import { orderRouter } from './routes/orderRoutes';
import { inquiryRouter } from './routes/inquiryRoutes';
import { promoRouter } from './routes/promoRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { uploadRouter } from './routes/uploadRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Security & Parsing Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Serve Static Uploaded Files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Minimal Request Logger
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'BOSKI LIMITED API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + 's',
  });
});

// Mount Routes
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/promo', promoRouter);

// Centralized Error Handling
app.use(errorHandler);
