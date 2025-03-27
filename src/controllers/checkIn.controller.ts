import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkInUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let checkinData = await prisma.dailyCheckinRewards.findUnique({
      where: { userId },
    });

    const todayDate = new Date().toISOString().split('T')[0];

    if (!checkinData) {
      checkinData = await prisma.dailyCheckinRewards.create({
        data: {
          userId,
          lastCheckIn: new Date(),
          streak: 1,
          coins: 100,
        },
      });
      return res.json({
        message: 'Checked in! You earned 100 coins',
        coins: checkinData.coins,
      });
    }

    const lastCheckInDate = checkinData.lastCheckIn
      ? checkinData.lastCheckIn.toISOString().split('T')[0]
      : null;

    if (lastCheckInDate === todayDate) {
      return res
        .status(400)
        .json({
          message: 'You have already claimed your daily check-in reward today.',
        });
    }

    let streak = checkinData.streak || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    if (lastCheckInDate === yesterdayDate) {
      streak += 1;
    } else {
      streak = 1;
    }

    const rewards = [100, 200, 200];
    const reward = rewards[streak % rewards.length];

    const updatedCheckinData = await prisma.dailyCheckinRewards.update({
      where: { userId },
      data: {
        coins: checkinData.coins + reward,
        streak,
        lastCheckIn: new Date(),
      },
    });

    return res.json({
      message: `Checked in! You earned ${reward} coins`,
      coins: updatedCheckinData.coins,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
