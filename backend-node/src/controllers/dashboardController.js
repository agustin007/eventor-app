const prisma = require('../config/database');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics for authenticated user
 * @access  Private
 */
// getStats: Aggregated stats for Organizer
const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find all events organized by this user
        const events = await prisma.event.findMany({
            where: { organizerId: userId },
            include: { tickets: true }
        });

        const totalEvents = events.length;

        let ticketsSold = 0;
        let revenue = 0;
        let totalViews = 0;

        events.forEach(event => {
            const sales = event.tickets.length;
            ticketsSold += sales;
            revenue += sales * parseFloat(event.price);
            // Mock views since we don't track them yet
            totalViews += sales * 5 + Math.floor(Math.random() * 100);
        });

        // Mock rating
        const rating = totalEvents > 0 ? 4.8 : 0;

        res.status(200).json({
            totalViews,
            ticketsSold,
            revenue,
            rating
        });
    } catch (error) {
        console.error('[Dashboard] Get stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

// getUserEvents: List of events organized by user
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.userId;

        const events = await prisma.event.findMany({
            where: { organizerId: userId },
            include: { tickets: true },
            orderBy: { date: 'desc' }
        });

        // Map to frontend interface
        const formattedEvents = events.map(event => ({
            title: event.title,
            status: 'Published', // Schema doesn't have status, default to Published
            views: event.tickets.length * 5 + 10, // Mock
            sales: event.tickets.length,
            id: event.id
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error('[Dashboard] Get events error:', error);
        res.status(500).json({ message: 'Error fetching user events' });
    }
};

module.exports = {
    getStats,
    getUserEvents
};
