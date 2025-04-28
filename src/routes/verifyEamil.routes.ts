import express from 'express';
import {  resendVerificationEmail, verifyEmail } from '../controllers/verifyEmail.controller';

const router = express.Router();

router.get('/verify-email', async (req, res) => {
  await verifyEmail(req, res);
});

router.post('/resend-verification', async (req, res) => {
    await resendVerificationEmail(req, res);
});

export default router;
