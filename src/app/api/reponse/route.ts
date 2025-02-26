// /src/app/api/reponse/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour les données entrantes
const reponseSchema = z.object({
  questionId: z.string().min(1, "L'ID de la question est requis"),
  reponse: z.string().min(5, "La réponse doit comporter au moins 5 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = reponseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { questionId, reponse } = validation.data;

    // Vérification de l'existence de la question
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: `Aucune question trouvée avec l'ID: ${questionId}` },
        { status: 404 }
      );
    }

    // Création de la réponse
    const createdReponse = await prisma.reponse.create({
      data: {
        content: reponse.trim(),
        question: { connect: { id: questionId } },
      },
    });

    return NextResponse.json(
      {
        message: "Réponse ajoutée avec succès",
        reponse: {
          id: createdReponse.id,
          content: createdReponse.content,
          createdAt: createdReponse.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API réponse :", error);
    return NextResponse.json(
      {
        error: `Erreur serveur : ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      },
      { status: 500 }
    );
  }
}










{
  /*}
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
*/
}
