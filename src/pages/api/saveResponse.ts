import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Assurez-vous que ce fichier est bien configuré

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { text } = req.body;
    const response = await prisma.response.create({
      data: { text },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
}
