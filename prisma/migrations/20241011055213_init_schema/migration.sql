/*
  Warnings:

  - You are about to drop the column `code` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boilercode` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Made the column `constraints` on table `Problem` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `input` on the `TestCase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "boilercode" JSONB NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "topics" TEXT[],
ALTER COLUMN "constraints" SET NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "input",
ADD COLUMN     "input" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explaination" TEXT,
    "problemId" INTEGER,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
