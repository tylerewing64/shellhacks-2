require('dotenv').config();
const db = require('../services/DatabaseService');

async function createUserOrganizationsTable() {
  try {
    console.log('🔧 Creating user_organizations table...');
    
    const connection = await db.getConnection();
    
    // Create user_organizations table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        organization_ein VARCHAR(20) NOT NULL,
        organization_name VARCHAR(255) NOT NULL,
        organization_description TEXT,
        organization_website_url VARCHAR(500),
        organization_logo_url VARCHAR(500),
        organization_profile_url VARCHAR(500),
        organization_slug VARCHAR(255),
        organization_location VARCHAR(255),
        organization_ntee_code VARCHAR(10),
        organization_ntee_code_meaning VARCHAR(255),
        organization_is_disbursable BOOLEAN DEFAULT NULL,
        organization_tags JSON,
        organization_matched_terms JSON,
        liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_organization (user_id, organization_ein),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_organization_ein (organization_ein),
        INDEX idx_liked_at (liked_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ user_organizations table created successfully');
    
    // Check if table was created
    const [tables] = await connection.execute("SHOW TABLES LIKE 'user_organizations'");
    if (tables.length > 0) {
      console.log('✅ Table exists and is ready');
      
      // Show table structure
      const [columns] = await connection.execute('DESCRIBE user_organizations');
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
      });
    } else {
      console.log('❌ Table creation failed');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Error creating user_organizations table:', error);
  } finally {
    process.exit(0);
  }
}

createUserOrganizationsTable();
