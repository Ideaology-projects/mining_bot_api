/*
  Warnings:

  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_telegramUserId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNumber" SET NOT NULL;
