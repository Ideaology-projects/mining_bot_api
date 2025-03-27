import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TopMinors = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        totalBalance: 'desc',
      },
      take: 10,
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
