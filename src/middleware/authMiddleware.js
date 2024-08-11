import { verifyToken } from '../utils/tokenUtils.js';
import { isBlacklisted } from '../utils/tokenBlacklist.js';

export const authMiddleware = (req, res, next) => {
    console.log('Headers:', req.headers);
    const authHeader = req.headers.authorization;
    // console.log('Auth header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    // console.log('Extracted token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token is no longer valid' });
    }

    try {
        const payload = verifyToken(token);
        const userId = payload.userId;
        const userType = payload.type;
        // console.log('Verified user ID:', userId);
        req.userId = userId;
        req.userType = userType;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
        
    }
};