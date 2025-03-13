//src/app/api/alarme/ajouter/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { nom, description, instructions, consequence, circuitId, parametres } = await req.json();

        // Validation des données
        if (!nom || !description || !instructions || !consequence || !circuitId || !parametres) {
            return NextResponse.json(
                { error: "Tous les champs sont obligatoires" },
                { status: 400 }
            );
        }

        // Créer une nouvelle alarme
        const nouvelleAlarme = await prisma.alarme.create({
            data: {
                nom,
                description,
                instruction: {
                    create: instructions.map((instruction: string, index: number) => ({
                        description: instruction,
                        ordre: index + 1, // Ajoutez la propriété `ordre`
                    })),
                },
                consequence,
                circuit: { connect: { id: circuitId } },
                Parametre: {
                    create: parametres.map((parametre: { nom: string; description: string }) => ({
                        nom: parametre.nom,
                        description: parametre.description,
                    })),
                },
            },
            include: {
                instruction: true,
                Parametre: true,
                circuit: true,
            },
        });

        return NextResponse.json({
            type: "alarme_ajoutee",
            result: nouvelleAlarme,
            toastify: true,
            message: `L'alarme "${nom}" a été ajoutée avec succès.`,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'alarme :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}