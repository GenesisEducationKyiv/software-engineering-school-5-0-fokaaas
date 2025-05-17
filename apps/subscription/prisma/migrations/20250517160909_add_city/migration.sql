/*
  Warnings:

  - Added the required column `city` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "city" TEXT NOT NULL;
