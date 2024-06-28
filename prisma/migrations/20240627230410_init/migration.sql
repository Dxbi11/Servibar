/*
  Warnings:

  - A unique constraint covering the columns `[floorNumber]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productsId]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNumber]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "productsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Floor_floorNumber_key" ON "Floor"("floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_productsId_key" ON "Hotel"("productsId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
