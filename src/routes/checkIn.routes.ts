import express from 'express';
import { checkInUser } from '../controllers/checkIn.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/daily-checkin-rewards/:id', authMiddleware, async (req, res) => {
  await checkInUser(req, res);
});

export default router;
