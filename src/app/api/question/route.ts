// /src/app/api/question/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type QuestionWithReponse = {
  id: string;
  content: string;
  reponse: {
    id: string;
    content: string;
    questionId: string;
  } | null;
};

export async function POST(req: Request) {
  try {
    // Récupérer les données envoyées par le client
    const { question } = await req.json();

    // Vérifier si la question est fournie
    if (!question) {
      return NextResponse.json(
        { error: "Question manquante" },
        { status: 400 }
      );
    }

    // Recherche d'une question existante dans la base de données
    let existingQuestion: QuestionWithReponse | null =
      await prisma.question.findUnique({
        where: { content: question },
        include: { reponse: true }, // Inclure la réponse liée
      });

    // Si la question n'existe pas, en créer une nouvelle
    if (!existingQuestion) {
      existingQuestion = await prisma.question.create({
        data: {
          content: question, // Contenu de la question
          reponse: {
            create: { content: "" }, // Créer une réponse vide
          },
        },
        include: { reponse: true }, // Inclure la réponse
      });
    }

    // Retourner la question et la réponse (même si la réponse est vide)
    return NextResponse.json({
      id: existingQuestion.id,
      content: existingQuestion.content,
      reponse: existingQuestion.reponse?.content || null, // Si aucune réponse, renvoyer null
    });
  } catch (error) {
    // Gérer les erreurs du serveur
    console.error("Erreur API question :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
