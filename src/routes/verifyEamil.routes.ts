import express from 'express';
import {  resendOtp, verifyOtp } from '../controllers/verifyEmail.controller';

const router = express.Router();
router.post('/verify-otp', async (req, res) => {
  await verifyOtp(req, res);
});

router.post('/resend-otp', async (req, res) => {
  await resendOtp(req, res);
});

export default router;
