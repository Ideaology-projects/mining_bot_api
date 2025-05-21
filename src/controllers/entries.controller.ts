import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const entriesAgaintsUser = async (req: Request, res: Response) => {
 const userId = req.user?.id;
  const { uuid, value } = req.body;

    if (!uuid || !value) {
        return res.status(400).json({ success: false, message: 'uuid and value are required' });
    }

    try {
    const entry = await prisma.entry.upsert({
      where: {
        uuid_userId: {
          uuid,
          userId: Number(userId),
        },
      },
      update: {
        value,
      },
      create: {
        uuid,
        value,
        userId: Number(userId),
      },
    });

    res.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error upserting entry:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getEntryAgainstUser = async (req: Request, res: Response) => {
 const userId = req.user?.id;
 try {
  const entry = await prisma.entry.findMany({
    where: {
      id:userId
    }
  })
  res.json({ success: true, data: entry });
 } catch (error) {
    console.error('Error getting entry:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
 }
}