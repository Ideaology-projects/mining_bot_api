import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prismaClient';
import { sendResetEmail } from '../utils/invitationEmail';
import { generateToken } from '../utils/jwt';
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
  
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = generateToken(user.email || '', user.id);
    const expiration = new Date(Date.now() + 3600000);
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); 
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExp: expiration, otpExpiresAt:otpExpiration, otp },
    });

    await sendResetEmail(email, resetToken, otp);
    res.json({ message: 'Password reset email with OTP has been sent' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, confirmPassword} = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otpVerified) {
      return res.status(403).json({ message: 'OTP verification required before resetting password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
        otpVerified: false,
      },
    });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

