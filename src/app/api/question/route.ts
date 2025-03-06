// /src/app/api/question/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { motCleText } = await req.json();
console.log("motclé",motCleText)
    if (!motCleText || !motCleText.trim()) {
      return NextResponse.json({ error: "La question est vide ou mal formatée" }, { status: 400 });
    }

    const match = motCleText.match(/\d+/);
    const requestedLevel = match ? parseInt(match[0]) : null;

    console.log("match",match)
    console.log("requestedlevel",requestedLevel)

    if (motCleText.toLowerCase().includes("niveau condenseur") && requestedLevel === null) {
      const results = await prisma.condenseurNiveau.findMany({
        orderBy: { reglage: "desc" },
      });
      return NextResponse.json({ type: "list", results });
    }

    if (requestedLevel !== null) {
      const exactMatch = await prisma.condenseurNiveau.findFirst({
        where: { reglage: requestedLevel },
      });

      if (exactMatch) {
        return NextResponse.json({ type: "single", result: exactMatch, message: "Correspondance exacte trouvée." });
      }

      // Trouver les niveaux les plus proches
      const niveauSuperieur = await prisma.condenseurNiveau.findFirst({
        where: { reglage: { gte: requestedLevel } },
        orderBy: { reglage: "asc" },
      });

      const niveauInferieur = await prisma.condenseurNiveau.findFirst({
        where: { reglage: { lte: requestedLevel } },
        orderBy: { reglage: "desc" },
      });

      console.log("niveauinf",niveauInferieur)
      console.log("niveausup",niveauSuperieur)

      const surroundingLevels = [niveauSuperieur, niveauInferieur].filter(Boolean);

      return NextResponse.json({ type: "range", results: surroundingLevels ,niveauInferieur:niveauInferieur});
    }
    return NextResponse.json({ error: "Aucune correspondance trouvée" }, { status: 404 });
  } catch (error) {
    console.error(`Erreur API lors de la requête ${req.url}:`, error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}