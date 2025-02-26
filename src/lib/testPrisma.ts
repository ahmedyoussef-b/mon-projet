import { prisma } from "@/lib/prisma";

async function testPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma est bien connecté !");
    const questions = await prisma.question.count();
    const reponses = await prisma.reponse.count();
    console.log(`🔹 Questions: ${questions}, Réponses: ${reponses}`);
  } catch (error) {
    console.error("❌ Erreur Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
