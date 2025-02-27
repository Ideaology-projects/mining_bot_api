import { Router } from 'express';
import {
  getReferralStatus,
  claimReferralRewards,
} from '../controllers/referral.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/referral-status', authMiddleware, getReferralStatus);
router.post('/claim', authMiddleware, claimReferralRewards);
export default router;
