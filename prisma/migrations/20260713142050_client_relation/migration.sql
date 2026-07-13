/*
  Warnings:

  - You are about to drop the column `clientId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `freelancerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.
  - You are about to alter the column `budget` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `customerName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_freelancerId_fkey";

-- DropIndex
DROP INDEX "Project_clientId_idx";

-- DropIndex
DROP INDEX "Project_freelancerId_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clientId",
DROP COLUMN "completedAt",
DROP COLUMN "currency",
DROP COLUMN "deletedAt",
DROP COLUMN "freelancerId",
DROP COLUMN "startDate",
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "linkedClientId" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "budget" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_linkedClientId_fkey" FOREIGN KEY ("linkedClientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
