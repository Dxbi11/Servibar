/*
  Warnings:

  - A unique constraint covering the columns `[minibarItemsId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "storehouseId" INTEGER;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "minibarItemsId" INTEGER;

-- CreateTable
CREATE TABLE "StoreHouse" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "StoreHouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_minibarItemsId_key" ON "Room"("minibarItemsId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storehouseId_fkey" FOREIGN KEY ("storehouseId") REFERENCES "StoreHouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
