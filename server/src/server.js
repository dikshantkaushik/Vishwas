import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './config/db.js';
import agreementRoutes from './routes/agreementRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health & Diagnostic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Vishwas Micro-Agreement API',
    database: {
      connected: isDBConnected(),
      status: isDBConnected() ? 'connected' : 'disconnected',
    },
  });
});

// Primary API Routes
app.use('/api/agreements', agreementRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to Vishwas Micro-Agreement Backend API',
    documentation: 'Use /api/agreements for CRUD endpoints, /api/health for system status.',
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Server Initialization
const startServer = async () => {
  // Attempt DB Connection
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Vishwas Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Agreements API: http://localhost:${PORT}/api/agreements`);
    console.log(`====================================================`);
  });
};

startServer();
