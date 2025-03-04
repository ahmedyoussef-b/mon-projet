// /src/app/api/question/route.ts

import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Importer l'instance unique de Prisma

export async function POST(req: Request) {
  try {
    const { questionText } = await req.json();

    // Vérifier si la question est valide
    if (!questionText?.trim()) {
      return NextResponse.json({ message: "Le texte de la question est vide." }, { status: 400 });
    }

    // Recherche de la question dans la base de données
    const question = await prisma.question.findFirst({
      where: { content: questionText },
      include: { reponse: true },
    });

    console.log(question)
    // Gérer le cas où la question n'existe pas
    if (!question) {
      return NextResponse.json({ message: "La question n'existe pas." }, { status: 404 });
    }

    // Gérer le cas où la question existe mais n'a pas de réponse
    if (!question.reponse || question.reponse.length === 0) {
      return NextResponse.json({ message: "Pas de réponse." }, { status: 404 });
    }

    // Retourner les réponses associées
    return NextResponse.json({ reponse: question.reponse.map((r) => r.content) });

  } catch (error: unknown) {  // 🔹 Remplacer "any" par "unknown"
    console.error("Erreur lors de la vérification de la question :", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: `Erreur Prisma : ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: "Une erreur inconnue s'est produite." }, { status: 500 });
  }
}