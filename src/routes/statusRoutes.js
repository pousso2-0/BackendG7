// src/routes/statusRoutes.js
import express from 'express';
import StatusController from '../controllers/statusController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware , StatusController.createStatus);
router.get('/:statusId', authMiddleware , StatusController.viewStatus);
router.delete('/del/:statusId', authMiddleware , StatusController.deleteStatus);
router.get('/all', authMiddleware , StatusController.getUserStatuses);
router.post('/message', authMiddleware , StatusController.sendMessageToStatus);


export default router;
