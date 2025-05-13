/*
  Warnings:

  - You are about to drop the column `type` on the `Booster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[boosterType]` on the table `Booster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boosterType` to the `Booster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Booster` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booster_type_key";

-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "type",
ADD COLUMN     "boosterType" TEXT NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booster_boosterType_key" ON "Booster"("boosterType");

-- AddForeignKey
ALTER TABLE "Booster" ADD CONSTRAINT "Booster_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BoosterTypeConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
