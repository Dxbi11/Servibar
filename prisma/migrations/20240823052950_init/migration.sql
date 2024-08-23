/*
  Warnings:

  - A unique constraint covering the columns `[hotelId]` on the table `StoreHouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hotelId` to the `StoreHouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreHouse" ADD COLUMN     "hotelId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoreHouse_hotelId_key" ON "StoreHouse"("hotelId");

-- AddForeignKey
ALTER TABLE "StoreHouse" ADD CONSTRAINT "StoreHouse_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
