// /src/app/api/reponse/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour les données entrantes
const reponseSchema = z.object({
  questionId: z.string().min(1, "L'ID de la question est requis"),
  reponse: z.string().min(5, "La réponse doit comporter au moins 5 caractères"),
});

// Fonction pour valider les données entrantes
function validateReponseData(data: unknown): { success: boolean; data?: z.infer<typeof reponseSchema>; error?: string } {
  const validation = reponseSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }
  return { success: true, data: validation.data };
}

// Fonction pour créer une réponse
async function createReponse(questionId: string, reponse: string) {
  // Vérification de l'existence de la question
  const existingQuestion = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!existingQuestion) {
    throw new Error(`Aucune question trouvée avec l'ID: ${questionId}`);
  }

  // Création de la réponse
  return await prisma.reponse.create({
    data: {
      content: reponse.trim(),
      question: { connect: { id: questionId } },
    },
  });
}

// Fonction principale pour gérer les requêtes POST
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation des données entrantes
    const validation = validateReponseData(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Vérification que validation.data est défini
    if (!validation.data) {
      return NextResponse.json(
        { error: "Données de validation manquantes." },
        { status: 400 }
      );
    }

    const { questionId, reponse } = validation.data;

    // Création de la réponse
    const createdReponse = await createReponse(questionId, reponse);

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