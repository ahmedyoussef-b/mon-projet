import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { questionId, reponse } = await req.json();

    if (!questionId || !reponse) {
      return NextResponse.json(
        { error: "Question ID et réponse sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si la question existe
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question introuvable" },
        { status: 404 }
      );
    }

    // Créer la réponse et l'associer à la question
    const createdReponse = await prisma.reponse.create({
      data: {
        content: reponse,
        questionId: questionId,
      },
    });

    return NextResponse.json({
      message: "Réponse ajoutée avec succès",
      reponse: createdReponse.content,
    });
  } catch (error) {
    console.error("Erreur API réponse :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
