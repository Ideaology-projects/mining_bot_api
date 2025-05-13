import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import dayjs from 'dayjs';

export const createBooster = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { multiplier, boosterType } = req.body;

  if (!multiplier || !boosterType) {
    res.status(400).json({ error: 'multiplier and typeConfig are required' });
    return;
  }

  try {
    const startTime = new Date();
    const endTime = dayjs(startTime).add(10, 'minute').toDate();

    const booster = await prisma.booster.create({
      data: {
        userId,
        multiplier,
        startTime,
        endTime,
        boosterType,
        isBoosted: true
      }
    });

    res.status(201).json({
      message: 'Booster created successfully',
      booster
    });

  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
