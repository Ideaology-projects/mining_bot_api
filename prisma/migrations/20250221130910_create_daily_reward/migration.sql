-- CreateTable
CREATE TABLE "DailyReward" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rewardAmount" INTEGER NOT NULL,
    "lastRewardTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardKey" INTEGER NOT NULL,

    CONSTRAINT "DailyReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyReward_userId_lastRewardTime_key" ON "DailyReward"("userId", "lastRewardTime");

-- AddForeignKey
ALTER TABLE "DailyReward" ADD CONSTRAINT "DailyReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
