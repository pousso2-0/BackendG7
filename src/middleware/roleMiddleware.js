// src/middleware/roleMiddleware.js
import { verifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

export const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No authorization header provided' });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = verifyToken(token);
            const userId = decoded.userId;
            const userType = decoded.type;

            // Vérifier si le type d'utilisateur est autorisé
            if (!allowedRoles.includes(userType)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            // Optionnel : récupérer l'utilisateur complet si nécessaire
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Role verification error:', error);
            return res.status(401).json({ message: 'Invalid token or insufficient permissions' });
        }
    };
};