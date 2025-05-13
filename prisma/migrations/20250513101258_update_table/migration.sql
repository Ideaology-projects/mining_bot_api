/*
  Warnings:

  - Added the required column `typeId` to the `Booster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booster" ADD COLUMN     "typeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booster" ADD CONSTRAINT "Booster_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BoosterTypeConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
