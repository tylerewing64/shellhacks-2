require('dotenv').config();
const DashboardService = require('../services/DashboardService');

async function testDashboard() {
  try {
    console.log('🧪 Testing Dashboard Service...');
    
    const userId = 1;
    console.log(`Testing with user ID: ${userId}`);
    
    // Test impact overview
    console.log('\n📊 Testing Impact Overview...');
    const impactData = await DashboardService.getImpactOverview(userId);
    console.log('Impact Overview Result:', JSON.stringify(impactData, null, 2));
    
    // Test recent activity
    console.log('\n📈 Testing Recent Activity...');
    const activityData = await DashboardService.getRecentActivity(userId, 10);
    console.log('Recent Activity Result:', JSON.stringify(activityData, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing dashboard:', error);
  }
}

testDashboard().then(() => process.exit(0));
