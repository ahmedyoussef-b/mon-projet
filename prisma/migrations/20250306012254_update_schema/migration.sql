-- CreateTable
CREATE TABLE "CondenseurNiveau" (
    "id" SERIAL NOT NULL,
    "instrument" TEXT NOT NULL,
    "reglage" INTEGER NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "CondenseurNiveau_pkey" PRIMARY KEY ("id")
);
