/*
  Warnings:

  - A unique constraint covering the columns `[reponseId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reponseId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reponse" DROP CONSTRAINT "Reponse_questionId_fkey";

-- DropIndex
DROP INDEX "Question_content_key";

-- DropIndex
DROP INDEX "Reponse_questionId_key";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "reponseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_reponseId_key" ON "Question"("reponseId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_reponseId_fkey" FOREIGN KEY ("reponseId") REFERENCES "Reponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
