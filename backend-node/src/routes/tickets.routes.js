const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { purchaseTicket, getMyTickets } = require('../controllers/ticketsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/tickets/purchase
 * @desc    Purchase a ticket
 * @access  Private
 */
router.post('/purchase',
    authenticateToken,
    [
        body('eventId').isInt().withMessage('Event ID must be a valid integer')
    ],
    purchaseTicket
);

/**
 * @route   GET /api/tickets/my-tickets
 * @desc    Get user's tickets
 * @access  Private
 */
router.get('/my-tickets', authenticateToken, getMyTickets);

module.exports = router;
