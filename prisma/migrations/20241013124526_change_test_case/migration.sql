/*
  Warnings:

  - You are about to drop the column `input` on the `TestCase` table. All the data in the column will be lost.
  - Made the column `problemId` on table `TestCase` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "input",
ALTER COLUMN "problemId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Input" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "testCaseId" INTEGER NOT NULL,

    CONSTRAINT "Input_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
