/*
  Warnings:

  - You are about to drop the column `initialMultiplier` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booster" ADD COLUMN     "initialMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "initialMultiplier";
