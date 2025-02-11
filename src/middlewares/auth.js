const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

async function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access token missing', success: false });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing', success: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', success: false });
        }
        return res.status(403).json({ message: 'Invalid token', success: false });
    }

}

async function isAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Access token missing', success: false });

    try {
        const user = await User.findById(req.user.id).populate('roleId');
        if (!user || user.roleId.name !== 'admin') {
            return res.status(403).json({ message: 'Access denied', success: false });
        }
        req.user = user; // Add user info for further use in the request
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error during authorization', success: false });
    }
}

module.exports = {
    authenticateToken,
    isAdmin
};
