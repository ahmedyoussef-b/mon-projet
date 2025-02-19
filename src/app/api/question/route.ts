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
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question manquante" },
        { status: 400 }
      );
    }

    // Recherche d'une question existante
    let existingQuestion: QuestionWithReponse | null =
      await prisma.question.findUnique({
        where: { content: question },
        include: { reponse: true },
      });

    if (!existingQuestion) {
      // Création d'une nouvelle question avec une réponse vide
      existingQuestion = await prisma.question.create({
        data: {
          content: question,
          reponse: {
            create: { content: "" }, // Crée une réponse vide
          },
        },
        include: { reponse: true }, // Inclure la relation `reponse`
      });
    }

    return NextResponse.json({
      id: existingQuestion.id,
      content: existingQuestion.content,
      reponse: existingQuestion.reponse?.content || null, // Assurez-vous que `reponse` est inclus
    });
  } catch (error) {
    console.error("Erreur API question :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
