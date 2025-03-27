import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prismaClient';
import { sendResetEmail } from '../utils/invitationEmail';
import { generateToken } from '../utils/jwt';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = generateToken(user.email || '', user.id);
    const expiration = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExp: expiration },
    });

    await sendResetEmail(email, resetToken);
    res.json({ message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Missing token or newPassword' });
    }

    let decoded: { id: number } | null = null;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    } catch (error) {
      console.error('JWT Verification Failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.id) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.resetToken || user.resetTokenExp! < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error Details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
