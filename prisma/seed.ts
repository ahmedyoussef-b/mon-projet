// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.condenseurNiveau.createMany({
        data: [
            { instrument: "LSHH001", reglage: 1000, action: "Alarme + Déclenchement TVcc" },
            { instrument: "LSH004", reglage: 800, action: "Alarme + ouverture de la vanne de décharge puis condenseur LV001 vers bâche tampon" },
            { instrument: "LSH003", reglage: 750, action: "Alarme" },
            { instrument: "LSH002", reglage: 700, action: "Fermeture de la vanne LV001" },
            { instrument: "LSH001", reglage: 630, action: "Fermeture de la vanne d’appoint normal CAP LV001 et d’appoint rapide CAP UV001" },
            { instrument: "LSL001", reglage: 580, action: "Ouverture vanne d’appoint normal CAP LV001" },
            { instrument: "LSL002", reglage: 530, action: "Ouverture vanne d’appoint rapide CAP UV001" },
            { instrument: "LSL003", reglage: 370, action: "Alarme + interdiction de démarrage des pompes CEX" },
            { instrument: "LSLL001", reglage: 240, action: "Alarme + déclenchement de la pompe CEX" }
        ],
    });

    console.log("Données insérées !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
