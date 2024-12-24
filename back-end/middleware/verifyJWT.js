const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        console.log('No Bearer token found');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        console.log('Decoded payload:', decoded);
        
        // Assign the whole UserInfo object first
        req.user = decoded.UserInfo;
        
        // Also map specific fields for backward compatibility
        req.user._id = decoded.UserInfo.id || decoded.UserInfo._id;
        
        // Ensure roles are available in both places
        req.roles = decoded.UserInfo.roles;
        req.user.roles = decoded.UserInfo.roles;
        
        next();
    });
};

module.exports = verifyJWT;