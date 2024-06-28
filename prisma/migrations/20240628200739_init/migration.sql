/*
  Warnings:

  - You are about to drop the column `productsId` on the `Hotel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_productsId_fkey";

-- DropIndex
DROP INDEX "Hotel_name_key";

-- DropIndex
DROP INDEX "Hotel_productsId_key";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "productsId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "hotelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
