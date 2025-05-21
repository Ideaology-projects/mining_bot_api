import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserWithRank {
  id: number;
  username: string;
  totalBalance: number;
  rank: number;
}

export const TopMinors = async (req: Request, res: Response): Promise<void> => {
  try {
 const users = await prisma.$queryRaw<UserWithRank[]>`
      SELECT
        id,
        username,
        "totalBalance",
        CASE
          WHEN "totalBalance" >= 300 THEN 1
          WHEN "totalBalance" >= 200 THEN 2
          WHEN "totalBalance" >= 100 THEN 3
          WHEN "totalBalance" >= 50 THEN 4
          ELSE 5
        END as rank
      FROM "User"
      ORDER BY rank ASC, "totalBalance" DESC
      LIMIT 20
    `;
    const usersWithTier = users.map(user => ({
      ...user,
      totalBalance: user.totalBalance.toString(),
      rank: user.rank.toString(),
      tier: getTier(Number(user.rank)),
    }));

    res.json({ success: true, data: usersWithTier });
  } catch (error) {
    console.error('Error fetching users with DB rank:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
function getTier(rank: number): string {
  if (rank === 1) return 'Mining Baron';
  if (rank === 2) return 'Elite Miner';
  if (rank === 3) return 'Pro Digger';
  if (rank === 4) return 'Skilled Miner';
  return 'Newbie';
}
