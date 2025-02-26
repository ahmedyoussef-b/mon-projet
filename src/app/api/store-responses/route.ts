// /src/app/api/store-responses/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

// Définir un schéma de validation pour les réponses
const responseSchema = z.array(
    z.object({
        content: z.string(),
        createdAt: z.string().optional(), // Rendre createdAt facultatif
    })
);

// Définir un type pour les réponses
type ResponseItem = z.infer<typeof responseSchema>[number];

// Stockage temporaire en mémoire avec un type spécifique
const responsesStore = new Map<string, ResponseItem[]>();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !responsesStore.has(id)) {
        return NextResponse.json({ error: "Réponses non trouvées" }, { status: 404 });
    }

    const responses = responsesStore.get(id);
    return NextResponse.json({ responses });
}

export async function POST(request: Request) {
    const data = await request.json();

    // Valider les données entrantes
    const validationResult = responseSchema.safeParse(data.responses);
    if (!validationResult.success) {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 15); // Générer un ID unique
    responsesStore.set(id, validationResult.data); // Stocker les réponses validées
    return NextResponse.json({ id });
}