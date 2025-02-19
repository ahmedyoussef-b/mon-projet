/*
  Warnings:

  - You are about to drop the column `reponseId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[content]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId]` on the table `Reponse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_reponseId_fkey";

-- DropIndex
DROP INDEX "Question_reponseId_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "reponseId";

-- CreateIndex
CREATE UNIQUE INDEX "Question_content_key" ON "Question"("content");

-- CreateIndex
CREATE UNIQUE INDEX "Reponse_questionId_key" ON "Reponse"("questionId");

-- AddForeignKey
ALTER TABLE "Reponse" ADD CONSTRAINT "Reponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
