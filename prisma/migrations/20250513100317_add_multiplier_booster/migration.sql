/*
  Warnings:

  - You are about to drop the column `typeId` on the `Booster` table. All the data in the column will be lost.
  - Added the required column `multiplier` to the `Booster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booster" DROP CONSTRAINT "Booster_typeId_fkey";

-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "typeId",
ADD COLUMN     "multiplier" DOUBLE PRECISION NOT NULL;
