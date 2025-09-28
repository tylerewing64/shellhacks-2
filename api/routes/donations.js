const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create a fake donation
router.post('/', DonationController.createDonation);

// Get user's donations
router.get('/', DonationController.getUserDonations);

// Get donation statistics
router.get('/stats', DonationController.getDonationStats);

// Get donation by ID
router.get('/:id', DonationController.getDonationById);

module.exports = router;
