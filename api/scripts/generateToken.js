require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generate a test token for user ID 1
const token = jwt.sign(
  { id: 1, email: 'test@gmail.com' },
  process.env.JWT_SECRET || 'test-secret',
  { expiresIn: '24h' }
);

console.log('🔑 Test JWT Token:');
console.log(token);
console.log('\n📋 Use this token in your API calls:');
console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3001/api/dashboard/impact-overview`);
