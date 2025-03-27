/*
  Warnings:

  - A unique constraint covering the columns `[telegramUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "telegramUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUserId_key" ON "User"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
