/*
  Warnings:

  - A unique constraint covering the columns `[floorNumber]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[minibarItemsId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId]` on the table `RoomStock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId,productId]` on the table `RoomStock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "minibarItemsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Floor_floorNumber_key" ON "Floor"("floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Room_minibarItemsId_key" ON "Room"("minibarItemsId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStock_roomId_key" ON "RoomStock"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStock_roomId_productId_key" ON "RoomStock"("roomId", "productId");
