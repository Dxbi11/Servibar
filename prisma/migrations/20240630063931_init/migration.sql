/*
  Warnings:

  - You are about to drop the column `roomId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `InvoiceItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[floorNumber]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId]` on the table `RoomStock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_roomId_fkey";

-- DropIndex
DROP INDEX "Floor_floorNumber_hotelId_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "roomId",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hotelId" INTEGER,
ADD COLUMN     "room" INTEGER;

-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "checked" BOOLEAN,
ADD COLUMN     "comment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Floor_floorNumber_key" ON "Floor"("floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStock_roomId_key" ON "RoomStock"("roomId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
