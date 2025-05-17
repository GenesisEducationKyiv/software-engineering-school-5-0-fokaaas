/*
  Warnings:

  - You are about to drop the column `is_approved` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `frequency` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('HOURLY', 'DAILY');

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "is_approved",
ADD COLUMN     "frequency" "Frequency" NOT NULL;
