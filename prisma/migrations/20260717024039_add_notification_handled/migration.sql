-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "handledAt" TIMESTAMP(3),
ADD COLUMN     "isHandled" BOOLEAN NOT NULL DEFAULT false;
