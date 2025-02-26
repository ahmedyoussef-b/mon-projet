// /src/app/api/question/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Définition du type Reponse
type Reponse = {
  id: string;
  content: string;
  imageUrl: string | null; // Modifié pour correspondre au type retourné par Prisma
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Définition du type QuestionWithReponse
type QuestionWithReponse = {
  id: string;
  content: string;
  reponse: Reponse[];
  createdAt: Date;
  updatedAt: Date;
};

// Fonction pour valider la question
function validateQuestion(question: string): { valid: boolean; error?: string } {
  if (!question || question.trim().length < 5) {
    return { valid: false, error: "La question est manquante ou trop courte (minimum 5 caractères)." };
  }
  if (question.trim().length > 500) {
    return { valid: false, error: "La question est trop longue (maximum 500 caractères)." };
  }
  const forbiddenChars = /[<>{}]/;
  if (forbiddenChars.test(question)) {
    return { valid: false, error: "La question contient des caractères spéciaux interdits." };
  }
  return { valid: true };
}

// Fonction principale pour gérer les requêtes POST
export async function POST(req: Request) {
  try {
    const { question, filter, page = 1, limit = 10 } = await req.json();
    console.log("Question reçue:", question);

    const validation = validateQuestion(question);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Recherche la question dans la base de données
    let existingQuestion: QuestionWithReponse | null = await prisma.question.findUnique({
      where: { content: question.trim() },
      include: { reponse: true },
    });

    // Si la question n'existe pas, elle est créée
    if (!existingQuestion) {
      existingQuestion = await prisma.question.create({
        data: {
          content: question.trim(),
        },
        include: { reponse: true }, // Inclure les réponses (vide pour une nouvelle question)
      });
    }

    // Vérification que existingQuestion n'est pas null
    if (!existingQuestion) {
      return NextResponse.json({ error: "Question non trouvée." }, { status: 404 });
    }

    const questionData = existingQuestion;

    // Filtrage des réponses
    let filteredResponses = questionData.reponse;
    if (filter === "recent") {
      filteredResponses = filteredResponses.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === "oldest") {
      filteredResponses = filteredResponses.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    // Pagination des réponses
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResponses = filteredResponses.slice(startIndex, endIndex);

    // Formatage des réponses pour la réponse JSON
    const responses = paginatedResponses.map((rep) => ({
      id: rep.id,
      content: rep.content,
      createdAt: rep.createdAt,
    }));

    // Renvoie la réponse JSON
    return NextResponse.json({
      id: questionData.id,
      content: questionData.content,
      responses: responses.length > 0 ? responses : [{ content: "" }], // Retourne une réponse vide si aucune réponse n'est associée
      pagination: {
        page,
        limit,
        totalResponses: filteredResponses.length,
        totalPages: Math.ceil(filteredResponses.length / limit),
      },
    });

  } catch (error) {
    console.error("Erreur API question :", error);
    return NextResponse.json(
      {
        error: `Erreur serveur : ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      },
      { status: 500 }
    );
  }
}