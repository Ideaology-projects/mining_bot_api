import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import { generateToken } from '../utils/jwt';
export const authenticateUser = async (req: Request, res: Response) => {
  const { walletAddress, referralCode, referredBy } = req.body;
  console.log('referredBy', referredBy);
  if (!walletAddress) {
    res.status(400).json({ error: 'Wallet address is required' });
    return;
  }

  try {
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });
    console.log('useruseruseruseruseruser', user);
    // If user doesn't exist, create one (and process referral if referralCode is provided)
    if (!user) {
      // If referralCode provided, try to find the referring user
      let referrer = null;
      if (referralCode) {
        referrer = await prisma.user.findUnique({
          where: { referralCode },
        });
      }

      user = await prisma.user.create({
        data: {
          walletAddress,
          // Save referredBy only if a valid referrer exists
          referredBy: referrer ? referrer.referralCode : null,
        },
      });

      // If a valid referrer is found, create the referral record and associated rewards
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            refereeId: user.id,
          },
        });

        // Create reward for the referrer (e.g., 100 points)
        await prisma.reward.create({
          data: {
            userId: referrer.id,
            points: 100, // Adjust points as needed
            type: 'referral_bonus',
            status: 'pending', // Mark as pending; change later as per your business logic
          },
        });

        // Create reward for the new user (e.g., 50 points)
        await prisma.reward.create({
          data: {
            userId: user.id,
            points: 50, // Adjust points as needed
            type: 'signup_bonus',
            status: 'pending',
          },
        });
      }
    }

    // Generate JWT token (assume generateToken is defined elsewhere)
    const token = generateToken(walletAddress, user.id);
    res.json({ token, user });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
  res.json({ message: 'Protected data accessed!', user: req?.user });
  return;
};
