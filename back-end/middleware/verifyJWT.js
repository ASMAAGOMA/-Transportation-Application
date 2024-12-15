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
        
        // Log the decoded payload to verify its structure
        console.log('Decoded payload:', decoded);
        
        // Ensure `decoded.UserInfo` and `decoded.UserInfo.id` are correct
        req.user = decoded.UserInfo.id;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};

module.exports = verifyJWT;