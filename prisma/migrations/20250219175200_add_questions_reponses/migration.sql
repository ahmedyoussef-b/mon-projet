/*
  Warnings:

  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reponse" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Reponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_content_key" ON "Question"("content");

-- CreateIndex
CREATE UNIQUE INDEX "Reponse_questionId_key" ON "Reponse"("questionId");

-- AddForeignKey
ALTER TABLE "Reponse" ADD CONSTRAINT "Reponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
