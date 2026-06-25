/*
  Warnings:

  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `PaymentConfirmation` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `recepientName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recepientPhone` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recepientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recepientPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtPurchase` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "recepientName" TEXT NOT NULL,
ADD COLUMN     "recepientPhone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "recepientName" TEXT NOT NULL,
ADD COLUMN     "recepientPhone" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "priceAtPurchase" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentConfirmation" DROP COLUMN "confirmedAt";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "publicId";
