const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.meet_session;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid session' });
    }
};

const optionalAuth = (req, res, next) => {
    const token = req.cookies.meet_session;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
        } catch (err) {
            // Ignore token errors for optional auth
        }
    }
    next();
};

module.exports = { requireAuth, optionalAuth };
