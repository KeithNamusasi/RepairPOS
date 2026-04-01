const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Use in-memory MongoDB for development without requiring MongoDB installation
// Set USE_REAL_MONGO=true in .env to use a real MongoDB database
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function startMongo() {
  // If USE_REAL_MONGO is true, use the MONGODB_URI from .env
  if (process.env.USE_REAL_MONGO === 'true' && process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  mongoServer = await MongoMemoryServer.create();
  return mongoServer.getUri();
}

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

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
const PORT = 5001;

async function start() {
  try {
    // Start in-memory MongoDB or use local MongoDB
    const mongoUri = process.env.MONGODB_URI 
      ? process.env.MONGODB_URI 
      : await startMongo();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
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