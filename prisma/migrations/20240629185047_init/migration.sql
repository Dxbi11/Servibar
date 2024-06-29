/*
  Warnings:

  - A unique constraint covering the columns `[floorNumber,hotelId]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Floor_floorNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Floor_floorNumber_hotelId_key" ON "Floor"("floorNumber", "hotelId");
