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

export const claimReferralRewards = async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;

  try {
    const pendingRewards = await prisma.reward.findMany({
      where: {
        userId: Number(currentUserId),
        status: 'pending',
      },
    });

    if (pendingRewards.length === 0) {
      res.status(400).json({ error: 'No pending rewards to claim.' });
      return;
    }

    // Mark all pending rewards as credited
    await prisma.reward.updateMany({
      where: {
        userId: Number(currentUserId),
        status: 'pending',
      },
      data: { status: 'credited' },
    });

    res.json({ message: 'Rewards claimed successfully.' });
    return;
  } catch (error) {
    console.error('Reward Claim Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
