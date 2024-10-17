/*
  Warnings:

  - You are about to drop the column `explaination` on the `Example` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Example" DROP COLUMN "explaination",
ADD COLUMN     "explanation" TEXT;
