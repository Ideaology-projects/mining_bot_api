/*
  Warnings:

  - You are about to drop the column `typeId` on the `Booster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `Booster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Booster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booster" DROP CONSTRAINT "Booster_typeId_fkey";

-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "typeId",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booster_type_key" ON "Booster"("type");
