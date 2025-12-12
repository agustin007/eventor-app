const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/', authenticateToken, getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/',
    authenticateToken,
    [
        body('fullName').trim().notEmpty().withMessage('Full name is required')
    ],
    updateProfile
);

module.exports = router;
