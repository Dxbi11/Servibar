/*
  Warnings:

  - You are about to drop the column `minibarItemsId` on the `Room` table. All the data in the column will be lost.
  - Made the column `date` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Floor_floorNumber_key";

-- DropIndex
DROP INDEX "Room_minibarItemsId_key";

-- DropIndex
DROP INDEX "RoomStock_roomId_key";

-- DropIndex
DROP INDEX "RoomStock_roomId_productId_key";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "minibarItemsId";
