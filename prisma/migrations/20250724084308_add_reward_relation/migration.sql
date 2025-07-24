/*
  Warnings:

  - A unique constraint covering the columns `[rewardId]` on the table `ReferralRewardClaim` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rewardId` to the `ReferralRewardClaim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferralRewardClaim" ADD COLUMN     "rewardId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRewardClaim_rewardId_key" ON "ReferralRewardClaim"("rewardId");

-- AddForeignKey
ALTER TABLE "ReferralRewardClaim" ADD CONSTRAINT "ReferralRewardClaim_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
