// /src/app/api/reponse/route.ts
{/*import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { content, questionId } = await req.json();

    if (!content || !questionId) {
      return NextResponse.json(
        { message: "Les champs 'content' et 'questionId' sont requis" },
        { status: 400 }
      );
    }

    const response = await prisma.reponse.create({
      data: {
        content,
        question: {
          connect: { id: questionId }, // Associe la réponse à une question existante
        },
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erreur API reponse :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
*/}