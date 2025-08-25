import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const roomEntriesAgaintsUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id; // assume user JWT se aaraha hai
    const { ceiling, floor, walls, windows, furniture, lighting } = req.body;

    if (!ceiling || !floor || !walls) {
      res.status(400).json({
        success: false,
        message: 'ceiling, floor, and walls are required',
      });
      return;
    }

    // check if room already exists for this user
    const existingRoom = await prisma.room.findUnique({
      where: { userId: Number(userId) },
    });

    if (existingRoom) {
      // update the existing room
      const updatedRoom = await prisma.room.update({
        where: { userId: Number(userId) },
        data: { ceiling, floor, walls, windows, furniture, lighting },
      });

      res.json({
        success: true,
        message: 'Room updated successfully',
        data: updatedRoom,
      });
      return;
    } else {
      // create a new room
      const newRoom = await prisma.room.create({
        data: {
          ceiling,
          floor,
          walls,
          windows,
          furniture,
          lighting,
          userId: Number(userId),
        },
      });

      res.json({
        success: true,
        message: 'Room created successfully',
        data: newRoom,
      });
      return;
    }
  } catch (error) {
    console.error('Error creating/updating room:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
    return;
  }
};
