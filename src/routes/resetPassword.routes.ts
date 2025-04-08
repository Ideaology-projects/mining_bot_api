import { Router } from 'express';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/forgotPassword.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/forgot-password', authMiddleware, async (req, res) => {
  await forgotPassword(req, res);
});

router.get('/reset-password', authMiddleware, async (req, res) => {
  await resetPassword(req, res);
});

export default router;
