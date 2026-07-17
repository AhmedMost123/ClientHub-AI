/*
  Warnings:

  - Added the required column `originalName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'TASK_EDITED';
ALTER TYPE "ActivityType" ADD VALUE 'TASK_DELETED';
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_UPDATED';

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "originalName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "content" DROP NOT NULL;
