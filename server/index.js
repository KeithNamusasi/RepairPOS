const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const purchaseRoutes = require('./routes/purchases');
const repairRoutes = require('./routes/repairs');
const savingsRoutes = require('./routes/savings');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sangalo-mriy.onrender.com',
    'https://backend-vgzn.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RepairPOS API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection and server start
const PORT = process.env.PORT || 5001;

async function start() {
  try {
    // Use MONGO_URI from environment (Set in Render dashboard)
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable not set');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

start();

module.exports = app;