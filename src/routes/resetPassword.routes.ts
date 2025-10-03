import { Router } from 'express';
import {
  forgotPassword,
  resetPassword,
  syncPassword,
} from '../controllers/forgotPassword.controller';
const router = Router();
// import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/forgot-password', async (req, res) => {
  await forgotPassword(req, res);
});

router.post('/reset-password', async (req, res) => {
  await resetPassword(req, res);
});

router.post('/sync-password', async (req, res) => {
  await syncPassword(req, res);
});

export default router;
