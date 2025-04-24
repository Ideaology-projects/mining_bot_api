import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const claimDailyReward = async (req: Request, res: Response) => {
  try {
    const { DebugTimeDB, DBlastreward, DBlastrewardkey } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const lastRewardTime = new Date(DBlastreward);

    const existingReward = await prisma.dailyReward.findFirst({
      where: {
        userId,
        lastRewardTime,
      },
    });

    if (existingReward) {
      res.status(400).json({ error: 'Reward already claimed today' });
      return;
    }

    // Insert new reward entry
    const newReward = await prisma.dailyReward.create({
      data: {
        userId,
        rewardAmount: DebugTimeDB,
        lastRewardTime,
        rewardKey: DBlastrewardkey,
      },
    });

    res
      .status(200)
      .json({ message: 'Reward claimed successfully', reward: newReward });
    return;
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const getAllRewards = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const {id} = req.params;
    const userId = parseInt(id);
    const rewards = await prisma.dailyReward.findMany({
      where: { userId },
      orderBy: { lastRewardTime: 'desc' },
    });

    res.status(200).json({ rewards });
    return;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
