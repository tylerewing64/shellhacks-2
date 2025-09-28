// server.js - YourRightPocket Backend (Railway Version)
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.RAILWAY_TCP_PROXY_DOMAIN || process.env.DB_HOST || 'localhost',
  port: process.env.RAILWAY_TCP_PROXY_PORT || process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yourrightpocket',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Remove invalid MySQL2 options
  ...(process.env.RAILWAY_TCP_PROXY_DOMAIN && {
    ssl: {
      rejectUnauthorized: false // Required for Railway
    }
  })
};

console.log('🔗 Connecting to Railway MySQL with config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to database successfully!');
    
    // Check if our tables exist, if not create them
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (tables.length === 0) {
      console.log('📝 Creating database tables...');
      await initializeDatabase(connection);
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 To fix this:');
    console.log('   1. Install MySQL locally, OR');
    console.log('   2. Deploy to Railway with MySQL service, OR');
    console.log('   3. Create a .env file with database credentials');
    console.log('   See LOCAL_DEVELOPMENT.md for details');
    
    // Don't exit in development - allow server to start without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Server starting without database connection (development mode)');
    }
  }
}

// Initialize database with our schema
async function initializeDatabase(connection) {
  const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      INDEX idx_email (email)
    )`,
    
    `CREATE TABLE IF NOT EXISTS bank_accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      plaid_account_id VARCHAR(255) UNIQUE NOT NULL,
      account_name VARCHAR(255) NOT NULL,
      account_type ENUM('checking', 'savings', 'credit') NOT NULL,
      bank_name VARCHAR(255) NOT NULL,
      last_four VARCHAR(4) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category ENUM('education', 'healthcare', 'community', 'environment', 'other') NOT NULL,
      ein VARCHAR(20),
      website VARCHAR(255),
      logo_url VARCHAR(500),
      verified BOOLEAN DEFAULT FALSE,
      total_received DECIMAL(12,2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS user_charity_preferences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      organization_id INT NOT NULL,
      allocation_percentage DECIMAL(5,2) NOT NULL DEFAULT 100.00,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_org (user_id, organization_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS user_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE NOT NULL,
      auto_donate_threshold DECIMAL(5,2) DEFAULT 5.00,
      round_up_enabled BOOLEAN DEFAULT TRUE,
      max_daily_roundup DECIMAL(5,2) DEFAULT 10.00,
      notification_email BOOLEAN DEFAULT TRUE,
      notification_push BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS user_balances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE NOT NULL,
      current_balance DECIMAL(10,2) DEFAULT 0.00,
      total_accumulated DECIMAL(12,2) DEFAULT 0.00,
      total_donated DECIMAL(12,2) DEFAULT 0.00,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      account_id INT NOT NULL,
      plaid_transaction_id VARCHAR(255) UNIQUE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      rounded_amount DECIMAL(10,2) NOT NULL,
      roundup_amount DECIMAL(10,2) NOT NULL,
      merchant_name VARCHAR(255),
      category VARCHAR(100),
      transaction_date DATE NOT NULL,
      processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS donations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      organization_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      transaction_ids TEXT,
      stripe_payment_intent_id VARCHAR(255),
      status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS impact_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      organization_id INT NOT NULL,
      metric_name VARCHAR(255) NOT NULL,
      metric_value DECIMAL(10,2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )`
  ];
  
  for (const query of createTableQueries) {
    await connection.execute(query);
  }
  
  // Insert sample organizations
  await connection.execute(`
    INSERT IGNORE INTO organizations (name, description, category, verified) VALUES
    ('Local Food Bank', 'Provides meals to families in need', 'community', TRUE),
    ('Education First', 'Supplies school materials to underserved communities', 'education', TRUE),
    ('Community Health Clinic', 'Provides healthcare access to low-income families', 'healthcare', TRUE),
    ('Green Future Initiative', 'Environmental conservation and tree planting', 'environment', TRUE)
  `);
  
  console.log('✅ Database tables created successfully!');
}

// Plaid configuration
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

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Helper function to round up amount
const roundUpAmount = (amount) => {
  const rounded = Math.ceil(amount);
  return {
    original: amount,
    rounded: rounded,
    roundup: rounded - amount
  };
};

// Routes

// Health check - Railway deployment check
app.get('/', (req, res) => {
  res.json({ 
    message: 'YourRightPocket API is running!', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Railway MySQL'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.json({ 
      status: 'WARNING', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      message: 'Database not available - check LOCAL_DEVELOPMENT.md for setup instructions',
      error: error.message
    });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName, phone]
    );
    
    const userId = result.insertId;
    
    // Create default settings
    await pool.execute(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [userId]
    );
    
    // Create balance record
    await pool.execute(
      'INSERT INTO user_balances (user_id) VALUES (?)',
      [userId]
    );
    
    // Generate JWT token
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, email, firstName, lastName }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.execute(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const validPassword = password == user.password_hash;
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Organizations Routes
app.get('/api/organizations', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM organizations WHERE verified = TRUE';
    let params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY name';
    
    const [organizations] = await pool.execute(query, params);
    res.json({ organizations });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
              ub.current_balance, ub.total_accumulated, ub.total_donated,
              us.auto_donate_threshold, us.round_up_enabled
       FROM users u
       LEFT JOIN user_balances ub ON u.id = ub.user_id
       LEFT JOIN user_settings us ON u.id = us.user_id
       WHERE u.id = ?`,
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  await testConnection();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 YourRightPocket server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(console.error);