-- CreateTable
CREATE TABLE "ReferralRewardClaim" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rewardAmount" INTEGER NOT NULL,
    "rewardTier" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralRewardClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRewardClaim_userId_rewardTier_key" ON "ReferralRewardClaim"("userId", "rewardTier");

-- AddForeignKey
ALTER TABLE "ReferralRewardClaim" ADD CONSTRAINT "ReferralRewardClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
