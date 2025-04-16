import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const claimReferralReward = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const currentUserId = req.user?.id;
  const { rewardAmount, rewardTier } = req.body;

  if (!currentUserId) {
    res.status(401).json({ message: 'Unauthorized: User ID not found.' });
  }

  if (!rewardAmount || !rewardTier) {
    res
      .status(400)
      .json({ message: 'rewardAmount and rewardTier are required.' });
  }

  try {
    const referralCount = await prisma.referral.count({
      where: {
        referrerId: currentUserId,
      },
    });

    let eligibleAmount = 0;
    let eligibleTier = 0;

    if (referralCount >= 50) {
      eligibleAmount = 50000;
      eligibleTier = 1;
    } else if (referralCount >= 25) {
      eligibleAmount = 25000;
      eligibleTier = 2;
    } else if (referralCount >= 10) {
      eligibleAmount = 10000;
      eligibleTier = 3;
    } else {
      res
        .status(400)
        .json({ message: 'Not enough referrals to claim a reward.' });
    }

    if (rewardAmount !== eligibleAmount || rewardTier !== eligibleTier) {
      res
        .status(400)
        .json({
          message: 'Invalid reward tier or amount based on referral count.',
        });
    }

    const existingClaim = await prisma.referralRewardClaim.findFirst({
      where: {
        userId: currentUserId,
        rewardTier,
      },
    });

    if (existingClaim) {
      res
        .status(400)
        .json({ message: 'Reward already claimed for this tier.' });
    }

    await prisma.referralRewardClaim.create({
      data: {
        userId: currentUserId,
        rewardAmount,
        rewardTier,
        claimedAt: new Date(),
      },
    });

    res.json({
      message: `Successfully claimed a reward of ${rewardAmount} for tier ${rewardTier}.`,
    });
  } catch (error) {
    console.error('Reward Claim Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
