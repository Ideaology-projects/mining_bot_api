/*
  Warnings:

  - You are about to drop the column `typeId` on the `Booster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booster" DROP CONSTRAINT "Booster_typeId_fkey";

-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "typeId";
