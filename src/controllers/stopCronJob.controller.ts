import { Request, Response } from 'express';
import prisma from '../database/prismaClient';


export const changeOnlineStatus = async(req: Request, res: Response): Promise<void> => {
   const userId = req.user.id;
   
   try {
    const { isOnline } = req.body;
    if (!userId || typeof isOnline !== 'boolean') {
    res.status(400).json({ message: 'Missing or invalid parameters' });
    return
    }

    await prisma.user.update({
        where: { id: userId },
        data: { isOnline }
    })

    res.status(200).json({ message: `User ${isOnline ? 'online' : 'offline'}` });

  }catch (error) {
    console.error('Failed to update user status:', error);
    res.status(500).json({ message: 'Internal server error' });
    return
   }
}