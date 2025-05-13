import cron from 'node-cron';
import prisma from '../database/prismaClient';

cron.schedule('* * * * *', async () => {
  const now = new Date();
  console.log('⛏️ Running mining cron job at', now.toISOString());

  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      const booster = await prisma.booster.findFirst({
        where: {
          userId: user.id,
          isBoosted: true,
          startTime: { lte: now },
          endTime: { gte: now }
        }
      });

      const initialMultiplier = booster?.initialMultiplier ?? 1;
      const totalMultiplier = booster
        ? initialMultiplier + booster.multiplier
        : initialMultiplier;

      const incrementAmount = 0.1 * totalMultiplier;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalBalance: {
            increment: incrementAmount
          }
        }
      });

      console.log(
        `✔️ User ${user.id} mined ${incrementAmount} (multiplier: ${totalMultiplier})`
      );
    }
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
});
