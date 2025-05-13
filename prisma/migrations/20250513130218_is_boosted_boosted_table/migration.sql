/*
  Warnings:

  - You are about to drop the column `isActive` on the `Booster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "isActive",
ADD COLUMN     "isBoosted" BOOLEAN NOT NULL DEFAULT false;
