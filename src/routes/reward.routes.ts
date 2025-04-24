import express from 'express';
import {
  claimDailyReward,
  getAllRewards,
} from '../controllers/reward.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/daily-reward', authMiddleware, claimDailyReward);
router.get('/all-reward/:id', authMiddleware, getAllRewards);

export default router;
