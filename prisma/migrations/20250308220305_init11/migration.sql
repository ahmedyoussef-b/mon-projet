-- CreateEnum
CREATE TYPE "Temperature" AS ENUM ('HAUTE', 'BASSE', 'CRITIQUE');

-- CreateEnum
CREATE TYPE "Pression" AS ENUM ('ELEVEE', 'FAIBLE', 'STABLE');

-- CreateEnum
CREATE TYPE "NiveauxPrecie" AS ENUM ('MAX', 'MIN', 'MOYEN');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('OUVERT', 'FERME', 'INTERMEDIAIRE');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('DEMARRAGE', 'DECLENCHEMENT', 'OUVERTURE', 'FERMETURE');

-- CreateTable
CREATE TABLE "Partie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Partie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "partieId" INTEGER NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organe" (
    "id" SERIAL NOT NULL,
    "nomSpecifique" TEXT NOT NULL,
    "nomCircuit" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "temps" TEXT,
    "temperatures" TEXT,
    "debits" TEXT,
    "pressions" TEXT,
    "deltaT" TEXT,
    "deltaP" TEXT,
    "deltaTemps" TEXT,
    "circuitId" INTEGER NOT NULL,

    CONSTRAINT "Organe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionDemarrage" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "ConditionDemarrage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionDeclenchement" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "ConditionDeclenchement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionOuverture" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "ConditionOuverture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionFermeture" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "ConditionFermeture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Niveau" (
    "id" SERIAL NOT NULL,
    "instrument" TEXT NOT NULL,
    "reglage" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionManoeuvre" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "organeId" INTEGER NOT NULL,

    CONSTRAINT "ConditionManoeuvre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etape" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "conditionManoeuvreId" INTEGER NOT NULL,

    CONSTRAINT "Etape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SousEtape" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "etapeId" INTEGER NOT NULL,

    CONSTRAINT "SousEtape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarme" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "consequence" TEXT NOT NULL,
    "circuitId" INTEGER NOT NULL,

    CONSTRAINT "Alarme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruction" (
    "id" SERIAL NOT NULL,
    "ordre" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "alarmeId" INTEGER NOT NULL,

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegroupementNiveaux" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegroupementNiveaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametre" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "alarmeid" INTEGER NOT NULL,

    CONSTRAINT "Parametre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganeToRegroupementNiveaux" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrganeToRegroupementNiveaux_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NiveauToRegroupementNiveaux" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NiveauToRegroupementNiveaux_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganeToRegroupementNiveaux_B_index" ON "_OrganeToRegroupementNiveaux"("B");

-- CreateIndex
CREATE INDEX "_NiveauToRegroupementNiveaux_B_index" ON "_NiveauToRegroupementNiveaux"("B");

-- AddForeignKey
ALTER TABLE "Circuit" ADD CONSTRAINT "Circuit_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organe" ADD CONSTRAINT "Organe_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionDemarrage" ADD CONSTRAINT "ConditionDemarrage_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionDeclenchement" ADD CONSTRAINT "ConditionDeclenchement_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionOuverture" ADD CONSTRAINT "ConditionOuverture_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionFermeture" ADD CONSTRAINT "ConditionFermeture_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Niveau" ADD CONSTRAINT "Niveau_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionManoeuvre" ADD CONSTRAINT "ConditionManoeuvre_organeId_fkey" FOREIGN KEY ("organeId") REFERENCES "Organe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etape" ADD CONSTRAINT "Etape_conditionManoeuvreId_fkey" FOREIGN KEY ("conditionManoeuvreId") REFERENCES "ConditionManoeuvre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SousEtape" ADD CONSTRAINT "SousEtape_etapeId_fkey" FOREIGN KEY ("etapeId") REFERENCES "Etape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarme" ADD CONSTRAINT "Alarme_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_alarmeId_fkey" FOREIGN KEY ("alarmeId") REFERENCES "Alarme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parametre" ADD CONSTRAINT "Parametre_alarmeid_fkey" FOREIGN KEY ("alarmeid") REFERENCES "Alarme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganeToRegroupementNiveaux" ADD CONSTRAINT "_OrganeToRegroupementNiveaux_A_fkey" FOREIGN KEY ("A") REFERENCES "Organe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganeToRegroupementNiveaux" ADD CONSTRAINT "_OrganeToRegroupementNiveaux_B_fkey" FOREIGN KEY ("B") REFERENCES "RegroupementNiveaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NiveauToRegroupementNiveaux" ADD CONSTRAINT "_NiveauToRegroupementNiveaux_A_fkey" FOREIGN KEY ("A") REFERENCES "Niveau"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NiveauToRegroupementNiveaux" ADD CONSTRAINT "_NiveauToRegroupementNiveaux_B_fkey" FOREIGN KEY ("B") REFERENCES "RegroupementNiveaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;
