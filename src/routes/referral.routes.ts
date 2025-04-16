import { Router } from 'express';
import {
  getReferralStatus,
  claimReferralRewards,
} from '../controllers/referral.controller';
import { claimReferralReward } from '../controllers/claimedReferralReward.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.get('/referral-status', authMiddleware, getReferralStatus);
router.post('/claim', authMiddleware, claimReferralRewards);

//Referral Reward Route
router.post('/referral-reward', authMiddleware, claimReferralReward);
export default router;
