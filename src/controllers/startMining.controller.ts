import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const startMinning = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  try {
    const now = new Date();

    const booster = await prisma.booster.findFirst({
      where: {
        userId,
        isBoosted:true,
        startTime: { lte: now },
        endTime: { gte: now }
      }
    });

    const multiplier = booster ? booster.multiplier : 1;
    const incrementAmount = 0.1 * multiplier;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { totalBalance: { increment: incrementAmount } }
    });

    res.json({
      message: 'Mining started',
      balance: updatedUser.totalBalance,
      multiplier,
      boosterUsed: booster?.boosterType || 'none' 
    });
  } catch (error) {
    res.status(500).json({ 
        success:false,
        message: 'Internal Server Error',error,
     });
  }
};
