/*
  Warnings:

  - You are about to drop the column `minibarItemsId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `StoreHouse` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `date` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StoreHouse" DROP CONSTRAINT "StoreHouse_productId_fkey";

-- DropIndex
DROP INDEX "Floor_floorNumber_key";

-- DropIndex
DROP INDEX "Room_minibarItemsId_key";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "storehouseId" INTEGER;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "minibarItemsId";

-- DropTable
DROP TABLE "StoreHouse";

-- CreateTable
CREATE TABLE "Storehouse" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "quantity" INTEGER,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Storehouse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Storehouse" ADD CONSTRAINT "Storehouse_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storehouse" ADD CONSTRAINT "Storehouse_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
