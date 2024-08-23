/*
  Warnings:

  - You are about to drop the column `storehouseId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `StoreHouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `StoreHouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storehouseId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storehouseId";

-- AlterTable
ALTER TABLE "StoreHouse" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoreHouse_productId_key" ON "StoreHouse"("productId");

-- AddForeignKey
ALTER TABLE "StoreHouse" ADD CONSTRAINT "StoreHouse_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
