const prisma = require('../config/database');

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Count total tickets
        const totalTickets = await prisma.ticket.count({
            where: { userId }
        });

        res.status(200).json({
            ...user,
            totalTickets,
            memberSince: user.createdAt
        });
    } catch (error) {
        console.error('[Profile] Get profile error:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { fullName } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { fullName },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('[Profile] Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
