// server.js - YourRightPocket Backend (Controller-Service-View Version)
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

// Import components
const db = require('./services/DatabaseService');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);
app.use('/api', routes); // Mount health endpoint at /api/health
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/users'));
app.use('/api/organizations', require('./routes/organizations'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Plaid configuration (for future use)
const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'development'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

// Helper function to round up amount (for future use)
const roundUpAmount = (amount) => {
  const rounded = Math.ceil(amount);
  return {
    original: amount,
    rounded: rounded,
    roundup: rounded - amount
  };
};

// Initialize database and start server
async function startServer() {
  try {
    await db.testConnection();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 YourRightPocket server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);