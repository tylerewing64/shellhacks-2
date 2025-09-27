const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.initializeConnection();
  }

  initializeConnection() {
    const dbConfig = {
      host: process.env.RAILWAY_TCP_PROXY_DOMAIN || process.env.DB_HOST || 'localhost',
      port: process.env.RAILWAY_TCP_PROXY_PORT || process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yourrightpocket',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(process.env.RAILWAY_TCP_PROXY_DOMAIN && {
        ssl: {
          rejectUnauthorized: false
        }
      })
    };

    console.log('🔗 Connecting to database with config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });

    this.pool = mysql.createPool(dbConfig);
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      const connection = await this.getConnection();
      console.log('✅ Connected to database successfully!');
      
      // Check if our tables exist, if not create them
      const [tables] = await connection.execute(
        "SHOW TABLES LIKE 'users'"
      );
      
      if (tables.length === 0) {
        console.log('📝 Creating database tables...');
        await this.initializeDatabase(connection);
      }
      
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('💡 To fix this:');
      console.log('   1. Install MySQL locally, OR');
      console.log('   2. Deploy to Railway with MySQL service, OR');
      console.log('   3. Create a .env file with database credentials');
      console.log('   See README.md for details');
      
      if (process.env.NODE_ENV === 'production') {
        throw error;
      } else {
        console.log('⚠️  Server starting without database connection (development mode)');
        return false;
      }
    }
  }

  async initializeDatabase(connection) {
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

  async execute(query, params = []) {
    try {
      const connection = await this.getConnection();
      const result = await connection.execute(query, params);
      connection.release();
      return result;
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  }

  async query(query, params = []) {
    try {
      const connection = await this.getConnection();
      const result = await connection.query(query, params);
      connection.release();
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();
