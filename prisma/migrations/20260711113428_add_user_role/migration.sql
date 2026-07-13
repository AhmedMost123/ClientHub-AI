-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FREELANCER', 'CLIENT', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'FREELANCER';
