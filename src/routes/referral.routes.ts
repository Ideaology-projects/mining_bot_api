import { Router } from 'express';
import {
  getReferralStatus,
} from '../controllers/referral.controller';
import { claimReferralReward,isClaimedReward} from '../controllers/claimedReferralReward.controller';
import { getClaimedRewards} from '../controllers/referral.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.get('/referral-status', authMiddleware, getReferralStatus);
router.post('/claim', authMiddleware, claimReferralReward);
router.post('/is-claimed', authMiddleware, isClaimedReward);

//Referral Reward Route
router.get('/referral-reward', authMiddleware, getClaimedRewards);
export default router;
