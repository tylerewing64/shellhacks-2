const express = require('express');
const router = express.Router();
const ApiResponse = require('../views/ApiResponse');
const db = require('../services/DatabaseService');

// Health check routes
router.get('/', (req, res) => {
  return ApiResponse.success(res, {
    message: 'YourRightPocket API is running!',
    status: 'OK',
    database: 'Railway MySQL'
  });
});

router.get('/health', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    return ApiResponse.healthCheck(res, {
      database: 'Connected'
    });
  } catch (error) {
    return ApiResponse.healthCheckWarning(res, 
      'Database not available - check README.md for setup instructions',
      {
        database: 'Disconnected',
        error: error.message
      }
    );
  }
});

module.exports = router;
