import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const activeBooster = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const booster = await prisma.booster.findMany({
      where: {
        userId: userId,
        isBoosted: true
      }
    });

    if (!booster) {
      res.status(404).json({ success: false, message: 'No active booster found' });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Active booster found',
      booster
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error
    });
  }
};

export const getTotalBalance = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const booster = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalBalance: true }
    });

    if (!booster) {
      res.status(404).json({ success: false, message: 'No active booster found' });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Active booster found',
      booster
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error
    });
  }
};