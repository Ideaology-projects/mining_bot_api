import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getReferralStatus = async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  try {
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: currentUserId,
      },
      include: { referee: true },
    });
    res.json({ referrals });
    return;
  } catch (error) {
    console.error('Referral Fetch Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const getClaimedRewards = async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const claimedRewards = await prisma.reward.findMany({
      where: {
        userId: Number(currentUserId),
        status: 'credited', // Only claimed rewards
      },
      orderBy: {
        createdAt: 'desc', // Optional: latest first
      },
    });

    res.json({ rewards: claimedRewards });
  } catch (error) {
    console.error('Get Claimed Rewards Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

