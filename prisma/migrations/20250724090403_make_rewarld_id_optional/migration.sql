-- DropForeignKey
ALTER TABLE "ReferralRewardClaim" DROP CONSTRAINT "ReferralRewardClaim_rewardId_fkey";

-- AlterTable
ALTER TABLE "ReferralRewardClaim" ALTER COLUMN "rewardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ReferralRewardClaim" ADD CONSTRAINT "ReferralRewardClaim_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
