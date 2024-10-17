/*
  Warnings:

  - The primary key for the `Example` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestCase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Input` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `input` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Input" DROP CONSTRAINT "Input_testCaseId_fkey";

-- AlterTable
ALTER TABLE "Example" DROP CONSTRAINT "Example_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Example_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Example_id_seq";

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Submission_id_seq";

-- AlterTable
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_pkey",
ADD COLUMN     "input" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "problemId" DROP NOT NULL,
ADD CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestCase_id_seq";

-- DropTable
DROP TABLE "Input";

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
