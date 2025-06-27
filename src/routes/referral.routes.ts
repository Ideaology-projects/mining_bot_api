import { Router } from 'express';
import {
  getReferralStatus,
  claimReferralRewards,
} from '../controllers/referral.controller';
import { claimReferralReward,isClaimedReward } from '../controllers/claimedReferralReward.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.get('/referral-status', authMiddleware, getReferralStatus);
router.post('/claim', authMiddleware, claimReferralRewards);
router.post('/is-claimed', authMiddleware, isClaimedReward);

//Referral Reward Route
router.get('/referral-reward', authMiddleware, claimReferralReward);
export default router;
