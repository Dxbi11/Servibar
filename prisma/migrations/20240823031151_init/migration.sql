/*
  Warnings:

  - You are about to drop the column `productId` on the `RoomStock` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `RoomStock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomStock" DROP CONSTRAINT "RoomStock_productId_fkey";

-- DropForeignKey
ALTER TABLE "RoomStock" DROP CONSTRAINT "RoomStock_roomId_fkey";

-- DropIndex
DROP INDEX "RoomStock_roomId_key";

-- DropIndex
DROP INDEX "RoomStock_roomId_productId_key";

-- AlterTable
ALTER TABLE "RoomStock" DROP COLUMN "productId",
DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "_RoomToRoomStock" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToRoomStock" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToRoomStock_AB_unique" ON "_RoomToRoomStock"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToRoomStock_B_index" ON "_RoomToRoomStock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToRoomStock_AB_unique" ON "_ProductToRoomStock"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToRoomStock_B_index" ON "_ProductToRoomStock"("B");

-- AddForeignKey
ALTER TABLE "_RoomToRoomStock" ADD CONSTRAINT "_RoomToRoomStock_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToRoomStock" ADD CONSTRAINT "_RoomToRoomStock_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRoomStock" ADD CONSTRAINT "_ProductToRoomStock_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRoomStock" ADD CONSTRAINT "_ProductToRoomStock_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
