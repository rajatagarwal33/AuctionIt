import express from 'express';
import { deleteNotification, getNotifications,} from '../controllers/notification.controller.js';
import { createNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/create', createNotification);
router.delete('/delete/:id', deleteNotification);
router.get('/get', getNotifications);

export default router;