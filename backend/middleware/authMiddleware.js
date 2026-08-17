const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return req.cookies ? req.cookies.meet_session : null;
};

const requireAuth = (req, res, next) => {
    const token = getToken(req);
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
    const token = getToken(req);
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

