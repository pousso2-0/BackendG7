import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = { id: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed' });
    }
};
