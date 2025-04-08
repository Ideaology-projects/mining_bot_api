import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, email, username, password, referralCode } = req.body;

    if (!walletAddress && (!email || !username || !password)) {
      return res
        .status(400)
        .json({ message: 'Wallet address or email/password is required!' });
    }

    let user = null;
    let referrer = null;

    if (referralCode) {
      referrer = await prisma.user.findUnique({ where: { referralCode } });
    }

    if (walletAddress) {
      user = await prisma.user.findUnique({ where: { walletAddress } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress,
            referredBy: referrer ? referrer.referralCode : null,
          },
        });
      }
    }

    // If still no user and email is provided, register with email/password
    if (!user && email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          walletAddress,
          referredBy: referrer ? referrer.referralCode : null,
        },
      });
    }

    // After user is created, handle referral reward creation
    if (referrer && user) {
      await prisma.referral.create({
        data: { referrerId: referrer.id, refereeId: user.id },
      });

      await prisma.reward.create({
        data: {
          userId: referrer.id,
          points: 100,
          type: 'referral_bonus',
          status: 'pending',
        },
      });

      await prisma.reward.create({
        data: {
          userId: user.id,
          points: 50,
          type: 'signup_bonus',
          status: 'pending',
        },
      });
    }

    if (!user) {
      return res.status(500).json({ message: 'User registration failed.' });
    }

    const token = generateToken(
      user.walletAddress || user.email || '',
      user.id,
    );

    return res
      .status(201)
      .json({ token, user, message: 'User created successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
  res.json({ message: 'Protected data accessed!', user: req?.user });
  return;
};

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required!' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const token = generateToken(user.email || '', user.id);

    return res.status(200).json({ token, user, message: 'Login successful!' });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
