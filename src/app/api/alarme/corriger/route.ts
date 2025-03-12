import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { ancienMotCle, nouveauMotCle } = await req.json();

        // Vérifier si l'alarme existe avec l'ancien mot-clé
        const alarmeExistante = await prisma.alarme.findFirst({
            where: { nom: ancienMotCle },
        });

        if (!alarmeExistante) {
            return NextResponse.json(
                { error: `L'alarme "${ancienMotCle}" n'existe pas.` },
                { status: 404 }
            );
        }

        // Mettre à jour le nom de l'alarme
        const alarmeCorrigee = await prisma.alarme.update({
            where: { id: alarmeExistante.id },
            data: { nom: nouveauMotCle },
        });

        return NextResponse.json({
            type: "alarme_corrigee",
            result: alarmeCorrigee,
            toastify: true,
            message: `L'alarme a été corrigée en "${nouveauMotCle}".`,
        });
    } catch (error) {
        console.error("Erreur lors de la correction de l'alarme :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}