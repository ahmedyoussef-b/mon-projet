
// Fichier : /api/alarme/modifier.ts
// Fichier : /api/alarme/modifier.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { ancienNom, nouveauNom,id } = req.body;

        if (!ancienNom || !nouveauNom) {
            return res.status(400).json({ error: "ancienNom et nouveauNom sont requis." });
        }

        try {
            // Vérifier si l'alarme existe
            const alarmeExistante = await prisma.alarme.findUnique({
                where: {
                    id: id,
                    nom: ancienNom },
            });

            if (!alarmeExistante) {
                return res.status(404).json({ error: "Cette alarme n'existe pas." });
            }

            // Mettre à jour l'alarme
            const alarmeModifiee = await prisma.alarme.update({
                where: {
                    id:id,
                    nom: ancienNom },
                data: { nom: nouveauNom },
            });

            res.status(200).json({ message: "Alarme modifiée avec succès", alarme: alarmeModifiee });
        } catch (error) {
            console.error("Erreur lors de la modification de l'alarme :", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
{/*}
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
    {*/}