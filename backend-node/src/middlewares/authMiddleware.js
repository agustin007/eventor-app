const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Protects routes that require authentication
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            },
            (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid or expired token' });
                }

                // Attach user info to request
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email
                };

                next();
            }
        );

    } catch (error) {
        console.error('[Auth] Token verification error:', error);
        res.status(500).json({ message: 'Error verifying token' });
    }
};

module.exports = { authenticateToken };
