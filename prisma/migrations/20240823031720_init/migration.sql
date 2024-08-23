/*
  Warnings:

  - You are about to drop the `_ProductToRoomStock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomToRoomStock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `RoomStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `RoomStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProductToRoomStock" DROP CONSTRAINT "_ProductToRoomStock_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToRoomStock" DROP CONSTRAINT "_ProductToRoomStock_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToRoomStock" DROP CONSTRAINT "_RoomToRoomStock_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToRoomStock" DROP CONSTRAINT "_RoomToRoomStock_B_fkey";

-- AlterTable
ALTER TABLE "RoomStock" ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ProductToRoomStock";

-- DropTable
DROP TABLE "_RoomToRoomStock";

-- AddForeignKey
ALTER TABLE "RoomStock" ADD CONSTRAINT "RoomStock_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomStock" ADD CONSTRAINT "RoomStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
