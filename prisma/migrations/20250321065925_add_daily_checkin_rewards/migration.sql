/*
  Warnings:

  - You are about to drop the column `coins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckIn` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streak` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "coins",
DROP COLUMN "lastCheckIn",
DROP COLUMN "streak";

-- CreateTable
CREATE TABLE "DailyCheckinRewards" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastCheckIn" TIMESTAMP(3),
    "streak" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyCheckinRewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckinRewards_userId_key" ON "DailyCheckinRewards"("userId");

-- AddForeignKey
ALTER TABLE "DailyCheckinRewards" ADD CONSTRAINT "DailyCheckinRewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
