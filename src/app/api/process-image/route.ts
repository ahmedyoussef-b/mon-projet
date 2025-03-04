{/*}
import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";

export async function POST(req: Request) {
    const data = await req.formData();
    const file = data.get("image") as File;

    if (!file) {
        return NextResponse.json({ error: "Aucune image fournie" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const outputPath = path.join(process.cwd(), "public", "processed-image.png");

    try {
        await sharp(buffer)
            .resize(800) // Redimensionnement pour optimiser l’OCR
            .grayscale() // Amélioration de la lecture du texte
            .toFile(outputPath);

        return NextResponse.json({ imagePath: "/processed-image.png" });
    } catch (error) {
        console.error("Erreur de traitement d'image :", error);
        return NextResponse.json({ error: "Erreur lors du traitement de l'image" }, { status: 500 });
    }
}
*/}