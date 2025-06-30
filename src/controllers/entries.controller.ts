import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const entriesAgaintsUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { uuid, value, mode } = req.body;

  if (!uuid || value === undefined || mode === undefined) {
    return res.status(400).json({ success: false, message: 'uuid, value, and mode are required' });
  }

  try {
    // Check if entry exists for given uuid and userId
    const existingEntry = await prisma.entry.findUnique({
      where: {
        uuid_userId: {
          uuid,
          userId: Number(userId),
        },
      },
    });

    if (existingEntry) {
      if (existingEntry.value === value && existingEntry.mode === mode) {
        // Value and mode are same, no update needed
        return res.json({ success: true, message: 'Entry already up-to-date', data: existingEntry });
      } else {
        // Value or mode is different, update both
        const updatedEntry = await prisma.entry.update({
          where: {
            uuid_userId: {
              uuid,
              userId: Number(userId),
            },
          },
          data: {
            value,
            mode,
          },
        });
        return res.json({ success: true, message: 'Entry updated', data: updatedEntry });
      }
    } else {
      // Entry does not exist, create it with value and mode
      const newEntry = await prisma.entry.create({
        data: {
          uuid,
          value,
          mode,
          userId: Number(userId),
        },
      });
      return res.json({ success: true, message: 'Entry created', data: newEntry });
    }
  } catch (error) {
    console.error('Error processing entry:', error);
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
