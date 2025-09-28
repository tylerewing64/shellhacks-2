require('dotenv').config();
const db = require('../services/DatabaseService');

// Helper function to generate random dates within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random amounts
function randomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Helper function to generate random roundup amounts
function generateRoundup(amount) {
  const rounded = Math.ceil(amount);
  return Math.round((rounded - amount) * 100) / 100;
}

async function generateFakeData() {
  try {
    console.log('🎭 Starting fake data generation...');

    // First, let's get the existing user and organizations
    const [users] = await db.execute('SELECT id FROM users LIMIT 1');
    const [organizations] = await db.execute('SELECT id FROM organizations');

    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    if (organizations.length === 0) {
      console.log('❌ No organizations found. Please run database initialization first.');
      return;
    }

    const userId = users[0].id;
    const orgIds = organizations.map(org => org.id);

    console.log(`👤 Using user ID: ${userId}`);
    console.log(`🏢 Found ${orgIds.length} organizations`);

    // 1. Create fake bank accounts
    console.log('💳 Creating fake bank accounts...');
    await db.execute(`
      INSERT IGNORE INTO bank_accounts (user_id, plaid_account_id, account_name, account_type, bank_name, last_four, is_primary, is_active)
      VALUES 
        (?, 'acc_123456789', 'Primary Checking', 'checking', 'Chase Bank', '1234', TRUE, TRUE),
        (?, 'acc_987654321', 'Savings Account', 'savings', 'Chase Bank', '5678', FALSE, TRUE),
        (?, 'acc_456789123', 'Credit Card', 'credit', 'Chase Bank', '9012', FALSE, TRUE)
    `, [userId, userId, userId]);

    const [accounts] = await db.execute('SELECT id FROM bank_accounts WHERE user_id = ?', [userId]);
    const accountIds = accounts.map(acc => acc.id);

    // 2. Create user settings
    console.log('⚙️ Creating user settings...');
    await db.execute(`
      INSERT IGNORE INTO user_settings (user_id, auto_donate_threshold, round_up_enabled, max_daily_roundup, notification_email, notification_push)
      VALUES (?, 5.00, TRUE, 10.00, TRUE, TRUE)
    `, [userId]);

    // 3. Create user balance
    console.log('💰 Creating user balance...');
    await db.execute(`
      INSERT IGNORE INTO user_balances (user_id, current_balance, total_accumulated, total_donated)
      VALUES (?, 0.00, 0.00, 0.00)
    `, [userId]);

    // 4. Create user charity preferences
    console.log('❤️ Creating charity preferences...');
    for (let i = 0; i < Math.min(3, orgIds.length); i++) {
      await db.execute(`
        INSERT IGNORE INTO user_charity_preferences (user_id, organization_id, allocation_percentage, is_active)
        VALUES (?, ?, ?, TRUE)
      `, [userId, orgIds[i], 100.00 / Math.min(3, orgIds.length)]);
    }

    // 5. Generate fake transactions (last 90 days)
    console.log('💸 Generating fake transactions...');
    const transactions = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const endDate = new Date();

    const merchants = [
      'Starbucks', 'McDonald\'s', 'Target', 'Amazon', 'Uber', 'Lyft', 
      'Whole Foods', 'CVS Pharmacy', 'Shell Gas Station', 'Subway',
      'Pizza Hut', 'Domino\'s', 'Walmart', 'Costco', 'Home Depot',
      'Best Buy', 'Apple Store', 'Netflix', 'Spotify', 'Hulu'
    ];

    const categories = [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Groceries', 'Gas', 'Utilities', 'Healthcare', 'Education'
    ];

    for (let i = 0; i < 150; i++) {
      const transactionDate = randomDate(startDate, endDate);
      const amount = randomAmount(5, 150);
      const roundedAmount = Math.ceil(amount);
      const roundupAmount = generateRoundup(amount);
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const accountId = accountIds[Math.floor(Math.random() * accountIds.length)];

      transactions.push([
        userId,
        accountId,
        `txn_${Date.now()}_${i}`,
        amount,
        roundedAmount,
        roundupAmount,
        merchant,
        category,
        transactionDate.toISOString().split('T')[0]
      ]);
    }

    // Insert transactions in batches
    const transactionQuery = `
      INSERT IGNORE INTO transactions 
      (user_id, account_id, plaid_transaction_id, amount, rounded_amount, roundup_amount, merchant_name, category, transaction_date)
      VALUES ?
    `;
    await db.query(transactionQuery, [transactions]);

    // 6. Generate fake donations
    console.log('🎁 Generating fake donations...');
    const donations = [];
    const totalRoundup = transactions.reduce((sum, txn) => sum + txn[5], 0);
    
    // Distribute donations across organizations
    for (let i = 0; i < 20; i++) {
      const donationDate = randomDate(startDate, endDate);
      const orgId = orgIds[Math.floor(Math.random() * orgIds.length)];
      const amount = randomAmount(1, 25);
      const status = Math.random() > 0.1 ? 'completed' : 'pending';
      
      donations.push([
        userId,
        orgId,
        amount,
        status,
        status === 'completed' ? donationDate.toISOString() : null
      ]);
    }

    const donationQuery = `
      INSERT IGNORE INTO donations 
      (user_id, organization_id, amount, status, completed_at)
      VALUES ?
    `;
    await db.query(donationQuery, [donations]);

    // 7. Generate impact metrics
    console.log('📊 Generating impact metrics...');
    const impactMetrics = [
      ['Meals Provided', 'meal', 'Each donation provides nutritious meals to families in need'],
      ['School Supplies', 'item', 'Educational materials distributed to students'],
      ['Medical Visits', 'visit', 'Healthcare services provided to underserved communities'],
      ['Trees Planted', 'tree', 'Environmental restoration through tree planting initiatives'],
      ['Hours of Service', 'hour', 'Volunteer hours contributed to community projects']
    ];

    for (const orgId of orgIds) {
      for (const [metricName, unit, description] of impactMetrics) {
        const value = randomAmount(50, 1000);
        await db.execute(`
          INSERT IGNORE INTO impact_metrics (organization_id, metric_name, metric_value, unit, description)
          VALUES (?, ?, ?, ?, ?)
        `, [orgId, metricName, value, unit, description]);
      }
    }

    // 8. Update user balance with total roundup
    console.log('💵 Updating user balance...');
    await db.execute(`
      UPDATE user_balances 
      SET current_balance = ?, total_accumulated = ?, total_donated = ?
      WHERE user_id = ?
    `, [totalRoundup, totalRoundup, totalRoundup, userId]);

    console.log('✅ Fake data generation completed successfully!');
    console.log(`📈 Generated:`);
    console.log(`   - ${transactions.length} transactions`);
    console.log(`   - ${donations.length} donations`);
    console.log(`   - ${impactMetrics.length * orgIds.length} impact metrics`);
    console.log(`   - Total roundup: $${totalRoundup.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Error generating fake data:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateFakeData()
    .then(() => {
      console.log('🎉 Fake data generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fake data generation failed:', error);
      process.exit(1);
    });
}

module.exports = generateFakeData;
