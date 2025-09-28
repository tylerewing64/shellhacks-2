require('dotenv').config();
const db = require('../services/DatabaseService');

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check donations table structure
    const [donationsColumns] = await db.execute('DESCRIBE donations');
    console.log('\n📋 Donations table columns:');
    donationsColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Check transactions table structure
    const [transactionsColumns] = await db.execute('DESCRIBE transactions');
    console.log('\n📋 Transactions table columns:');
    transactionsColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Check if we have any data
    const [donationCount] = await db.execute('SELECT COUNT(*) as count FROM donations');
    const [transactionCount] = await db.execute('SELECT COUNT(*) as count FROM transactions');
    
    console.log(`\n📊 Current data:`);
    console.log(`  - Donations: ${donationCount[0].count}`);
    console.log(`  - Transactions: ${transactionCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema().then(() => process.exit(0));
