// /src/app/api/question/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Définir un type pour les alarmes
{/*}
type Alarme = {
  nom: string;
  description: string;
  instructions: { description: string }[];
  consequence: string;
  Parametre: { nom: string; description: string }[];
};
{*/}
// Définir un type pour les conditions
type Condition = {
  id: number;
  description: string;
  organe: {
    id: number;
    nomSpecifique: string;
    
  };
};



// Fonction pour normaliser le texte de recherche
const normalizeSearchText = (text: string) => {
  return text.trim().toLowerCase();
};


// Fonction pour extraire un mot-clé spécifique du texte
const extractKeyword = (text: string, keyword: string): string | null => {
  const regex = new RegExp(`${keyword}\\s+(.+)$`, "i"); // Capture tous les mots après le mot-clé
  const match = text.match(regex);
  return match ? match[1].trim() : null; // Retourne la chaîne capturée, en supprimant les espaces inutiles
};

// Fonction pour extraire un mot-clé spécifique du texte1
const extractOneKeyword = (text: string, keyword: string): string | null => {
  const regex = new RegExp(`${keyword}\\s+([^\\d]+)`, "i"); // Capture tout sauf les chiffres
  const match = text.match(regex);
  return match ? match[1].trim() : null; // Retourne la chaîne capturée, en supprimant les espaces inutiles
};


// Fonction pour extraire un niveau (nombre) du texte
const extractLevelFromText = (text: string): number | null => {
  const match = text.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};



// Fonction pour formater le réglage pour la synthèse vocale
const formatReglageForSpeech = (reglage: string): string => {
  return reglage.replace(/\s+/g, " ").trim();
};



export async function POST(req: Request) {
  try {
    const { motCleText } = await req.json();
    console.log("motclé", motCleText);

    // Vérifier que le texte de recherche est valide
    if (!motCleText || !motCleText.trim()) {
      return NextResponse.json({ error: "La question est vide ou mal formatée" }, { status: 400 });
    }

    const normalizedText = normalizeSearchText(motCleText);

    console.log("normalizedText",normalizedText)

    // Cas 1 : Recherche de niveaux par nom spécifique d'organe avec une valeur
    if (normalizedText.includes("le niveau")) {
      const nomOrgane = extractOneKeyword(normalizedText, "niveau");
      const niveauDemande = extractLevelFromText(normalizedText);
      console.log("nomOrgane", nomOrgane)
      console.log("niveauDemande", niveauDemande)

      if (nomOrgane) {
        const niveaux = await prisma.niveau.findMany({
          where: { organe: { nomSpecifique: { contains: nomOrgane, mode: "insensitive" } } },
          include: { organe: true },
          orderBy: { id: "asc" },
        });

console.log("niveaux" ,niveaux) 

        if (niveaux.length === 0) {
          return NextResponse.json({ error: `Aucun niveau trouvé pour l'organe "${nomOrgane}".` }, { status: 404 });
        }

        // Cas 1.1 : Si une valeur est spécifiée
        if (niveauDemande !== null) {
          const niveauExact = niveaux.find((niveau) => {
            const numericValue = extractLevelFromText(niveau.reglage);
            console.log("numericValue",numericValue)

            return numericValue !== null && numericValue === niveauDemande;
          });
          if (niveauExact) {
            const formattedReglage = formatReglageForSpeech(niveauExact.reglage);
            return NextResponse.json({
              type: "exact",
              result: niveauExact,
              vocalMessage: `Détails pour le niveau ${formattedReglage} Milimetres.`,
            });
          } else {
            const niveauxTries = niveaux.sort((a, b) => {
              const numericValueA = extractLevelFromText(a.reglage);
              console.log("numericValueA", numericValueA)
              const numericValueB = extractLevelFromText(b.reglage);
              console.log("numericValueB", numericValueB)
              if (numericValueA === null || numericValueB === null) return 0;
              return numericValueA - numericValueB;
            });

            const niveauSuperieur = niveauxTries.find((niveau) => {
              console.log("niveausup", niveau)
              const numericValue = extractLevelFromText(niveau.reglage);
              console.log("numericValue", numericValue)
              return numericValue !== null && numericValue > niveauDemande;
            });

            const niveauInferieur = niveauxTries.findLast((niveau) => {
              console.log("niveauinf",niveau)
              const numericValue = extractLevelFromText(niveau.reglage);
              console.log("numericValue", numericValue)
              return numericValue !== null && numericValue < niveauDemande;
            });

            if (niveauSuperieur && niveauInferieur) {
              const formattedReglageInferieur = formatReglageForSpeech(niveauInferieur.reglage);
              console.log("formattedReglageInferieur", formattedReglageInferieur)
              const formattedReglageSuperieur = formatReglageForSpeech(niveauSuperieur.reglage);
              console.log("formattedReglageSuperieur", formattedReglageSuperieur)
              return NextResponse.json({
                type: "range",
                message: `Attention, le niveau ${niveauDemande} n'existe pas pour l'organe "${nomOrgane}".`,
                niveauInferieur,
                niveauSuperieur,
                vocalMessage: `Attention, le niveau inférieur est ${formattedReglageInferieur} et ca serait ${niveauInferieur.action}.`,
              });
            } else {
              return NextResponse.json({ error: `Aucun niveau trouvé autour de la valeur ${niveauDemande} pour l'organe "${nomOrgane}".` }, { status: 404 });
            }
          }
        }

        // Cas 1.2 : Si aucune valeur n'est spécifiée, afficher tous les niveaux
        return NextResponse.json({ type: "all", results: niveaux });
      } else {
        return NextResponse.json({ error: "Nom d'organe manquant dans la requête." }, { status: 400 });
      }
    }

    // Cas 2 : Recherche de tous les regroupements de niveaux
    if (normalizedText.includes("les niveaux")) {
      const regroupements = await prisma.regroupementNiveaux.findMany({
        select: {
          
          nom: true },
      });
      console.log("regroupements", regroupements)
      return NextResponse.json({ type: "regroupements", results:regroupements});
    }

    // Cas 3 : Recherche de conditions par nom spécifique d'organe
    const conditionKeywords = ["ConditionDemarrage", "ConditionDeclenchement", "ConditionOuverture", "ConditionFermeture"];

    const conditionMatch = conditionKeywords.find((keyword) =>
      new RegExp(keyword, "i").test(normalizedText)
    );    console.log("normalizedText", normalizedText)
    console.log("conditionKeywords",conditionKeywords)
    console.log("conditionMatch", conditionMatch)

    if (conditionMatch) {
      console.log("conditionMatch", conditionMatch)
      const nomSpecifique = extractKeyword(normalizedText, conditionMatch);
      console.log("nomSpecifique",nomSpecifique)
      if (nomSpecifique) {
        console.log("nomSpecifique", nomSpecifique)
        let conditions: Condition[] = [];

        switch (conditionMatch) {
         
          case "ConditionDemarrage":
            conditions = await prisma.conditionDemarrage.findMany({
              where: {
                 organe: {
                  nomSpecifique: { equals: nomSpecifique, mode: "insensitive" },
                                   } },
              include: { organe: true },

            });
            console.log("conditions", conditions)
            break;
          case "ConditionDeclenchement":
            conditions = await prisma.conditionDeclenchement.findMany({
              where: { organe: { nomSpecifique: { equals: nomSpecifique, mode: "insensitive" } } },
              include: { organe: true },
            });
            console.log("conditions", conditions)
            break;
          case "ConditionOuverture":
            conditions = await prisma.conditionOuverture.findMany({
              where: { organe: { nomSpecifique: { equals: nomSpecifique, mode: "insensitive" } } },
              include: { organe: true },
            });
            console.log("conditions", conditions)
            break;
          case "ConditionFermeture":
            conditions = await prisma.conditionFermeture.findMany({
              where: { organe: { nomSpecifique: { equals: nomSpecifique, mode: "insensitive" } } },
              include: { organe: true },
            });
            console.log("conditions",conditions)
            break;
          default:
            conditions = [];
            console.log("conditions", conditions)
        }
        conditions.sort((a, b) => a.id - b.id);

        console.log("condition envoyer",conditions)
        return NextResponse.json({
          type: conditionMatch,
          results: conditions.map((condition) => ({
            id: condition.id,
            description: condition.description,
            organe: {
              id: condition.organe.id,
              nomSpecifique: condition.organe.nomSpecifique,
            },
          })),
        });
      }
    }

    // Cas 4 : Recherche d'alarme par mot-clé après "alarme"
   
    if (normalizedText.includes("alarme")) {
      // Extraire tout le texte après "alarme" et le joindre en une seule chaîne sans espaces
      const alarmeKeyword = normalizedText.split("alarme")[1].replace(/\s+/g, "");
      console.log("alarmeKeyword", alarmeKeyword);

      // Rechercher dans la BDD si une alarme correspond au mot-clé
      const alarme = await prisma.alarme.findFirst({
        where: {
          nom: alarmeKeyword, // Recherche exacte du mot-clé dans le nom de l'alarme
        },
        include: {
          instructions: true, // Inclure les instructions associées
          Parametre: true, // Inclure les paramètres associés
          circuit: true, // Inclure le circuit associé
        },
      });

      if (alarme) {
        // 🔹 L'alarme existe → On renvoie les données
        return NextResponse.json({
          type: "alarme",
          result: alarme,
          vocalMessage: `Détails de l'alarme "${alarme.nom}".`,
        });
      } else {
        // ❌ Aucune alarme trouvée → On propose des actions à l'utilisateur
        return NextResponse.json({
          type: "nouvelle_alarme",
          message: `L'alarme "${alarmeKeyword}" n'existe pas.`,
          suggestion: {
            mot: alarmeKeyword,
          },
          actions: ["corriger", "ajouter", "supprimer"],
          toastify: true, // Permet d'afficher une alerte conditionnelle
        });
      }
    }
} catch (error) {
    console.error(`Erreur API lors de la requête ${req.url}:`, error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
