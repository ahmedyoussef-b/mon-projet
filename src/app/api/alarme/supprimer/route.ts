//src/app/api/alarme/supprimer/route.ts

// Fichier : /api/alarme/supprimer.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        const { nom ,id} = req.body;

        try {
            // Vérifier si l'alarme existe
            const alarmeExistante = await prisma.alarme.findUnique({
                where: {
                    id,
                    nom },
            });

            if (!alarmeExistante) {
                return res.status(404).json({ error: "Cette alarme n'existe pas." });
            }

            // Supprimer l'alarme
            await prisma.alarme.delete({
                where: {
                    id,
                    nom },
            });

            res.status(200).json({ message: "Alarme supprimée avec succès" });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'alarme :", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}


{/*}
import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    try {
        const { nom } = await req.json();

        // Validation des données
        if (!nom) {
            return NextResponse.json(
                { error: "Le champ 'nom' est obligatoire." },
                { status: 400 }
            );
        }

        // Vérifier si l'alarme existe
        const alarmeExistante = await prisma.alarme.findFirst({
            where: { nom }, // Utilisez `findUnique` si `nom` est unique
        });

        if (!alarmeExistante) {
            return NextResponse.json(
                { error: `L'alarme "${nom}" n'existe pas.` },
                { status: 404 }
            );
        }

        // Supprimer l'alarme et ses dépendances (si nécessaire)
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

        // Gestion des erreurs spécifiques
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") { // Erreur "Record not found"
                return NextResponse.json(
                    { error: `L'alarme spécifiée n'existe pas.` },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
    {*/}