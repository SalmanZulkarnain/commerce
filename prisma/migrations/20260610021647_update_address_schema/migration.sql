/*
  Warnings:

  - You are about to drop the column `cityId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `districtName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrictId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrictName` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "cityId",
DROP COLUMN "provinceId",
ADD COLUMN     "districtName" TEXT NOT NULL,
ADD COLUMN     "subdistrictId" TEXT NOT NULL,
ADD COLUMN     "subdistrictName" TEXT NOT NULL;
