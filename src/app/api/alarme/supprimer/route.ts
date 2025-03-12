import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    try {
        const { nom } = await req.json();

        // Vérifier si l'alarme existe
        const alarmeExistante = await prisma.alarme.findFirst({
            where: { nom },
        });

        if (!alarmeExistante) {
            return NextResponse.json(
                { error: `L'alarme "${nom}" n'existe pas.` },
                { status: 404 }
            );
        }

        // Supprimer l'alarme
        await prisma.alarme.delete({
            where: { id: alarmeExistante.id },
        });

        return NextResponse.json({
            type: "alarme_supprimee",
            toastify: true,
            message: `L'alarme "${nom}" a été supprimée avec succès.`,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'alarme :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}