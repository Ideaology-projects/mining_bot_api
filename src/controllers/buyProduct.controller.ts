import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

interface PurchaseRequestBody {
  userId: number;
  productId: number;
  quantity: number;
}

export const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body as PurchaseRequestBody;
    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { dailyCheckinRewards: true },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!user || !product) {
      return res.status(400).json({ message: 'Invalid user or product ID' });
    }

    const totalCost = product.price * quantity;

    if (
      !user.dailyCheckinRewards ||
      user.dailyCheckinRewards.coins < totalCost
    ) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          productId,
          quantity,
          totalCost,
        },
      }),
      prisma.dailyCheckinRewards.update({
        where: { userId },
        data: { coins: { decrement: totalCost } },
      }),
    ]);

    return res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error in purchaseProduct:', error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};
