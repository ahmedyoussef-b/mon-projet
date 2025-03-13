import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Création de la partie B0...");
        await prisma.partie.create({
            data: {
                nom: 'B0',
                circuits: {
                    create: [
                        {
                            nom: 'CEX',
                            organes: {
                                create: [
                                    // Organe 1 : Condenseur
                                    {
                                        nomSpecifique: 'Condenseur',
                                        nomCircuit: 'CEX',
                                        reference: 'COND001',
                                        niveaux: {
                                            create: [
                                                { instrument: 'LSHH001', reglage: "1000 mm", action: 'Alarme + Déclenchement TVcc' },
                                                { instrument: 'LSH004', reglage: "800 mm", action: 'Alarme + ouverture de la vanne de décharge puis condenseur LV001 vers bâche tampon' },
                                                { instrument: 'LSH003', reglage: "750 mm", action: 'Alarme' },
                                                { instrument: 'LSH002', reglage: "700 mm ", action: 'Fermeture de la vanne LV001' },
                                                { instrument: 'LSH001', reglage: "630 mm", action: 'Fermeture de la vanne d’appoint normal CAP LV001 et d’appoint rapide CAP UV001' },
                                                { instrument: 'Niveau T', reglage: "610 mm", action: 'Niveau de travail' },
                                                { instrument: 'LSL001', reglage: "580 mm", action: 'Ouverture vanne d’appoint normal CAP LV001' },
                                                { instrument: 'LSL002', reglage: "530 mm", action: 'Ouverture vanne d’appoint rapide CAP UV001' },
                                                { instrument: 'LSL003', reglage: "370 mm", action: 'Alarme + interdiction de démarrage des pompes CEX' },
                                                { instrument: 'LSLL001', reglage: "240 mm", action: 'Alarme + Déclenchement de la pompe CEX' },
                                            ],
                                        },
                                         conditionsDeclenchement: { create: [ { description: 'declanchement pompe CEX ,ou TVcc' }]},
                                         conditionsDemarrage: { create: [{description: "niveau de travaille 610 mm"}]},
                                         conditionsFermeture: { create: [{ description: "Arret centrale" }]},
                                         conditionsManoeuvre: { create: [{ description: "refrigeration" }]},
                                         conditionsOuverture: { create: [{ description: "niveau de travaille"}]},
                                        RegroupementNiveaux:{
                                            create:[{
                                                nom:"Niveaux condenseur",
                                                description:"different nivraux pour Condenseur",
                                                
                                            }]
                                        }
                                    },
                                    //  Organe 2 : Groupe CEX
                                    {
                                        nomSpecifique: 'Groupe CEX',
                                        nomCircuit: 'CEX',
                                        reference: 'GRP001',
                                        conditionsDemarrage: {create: {description: `✓ Pas de conditions de déclenchement du groupe CEX & Niveau condenseur > 370 mm`}},
                                        conditionsDeclenchement: {create: {description: `✗ Niveau condenseur très bas (< 240 mm) & Niveau bâche alimentaire très haut (> 2850 mm) & Ordre d’arrêt groupe`}},
                                    },

                                    // Organe 4 : bacheTampon
                                    {
                                        nomSpecifique: 'bacheTampon',
                                        nomCircuit: 'CAP',
                                        reference: 'TAMP001',
                                        niveaux: {
                                            create: [
                                                { instrument: 'LSHH001', reglage: "3070 mm", action: 'Alarme + verrouillage de la vanne d’appoint SER LCV001 / LCV002' },
                                                { instrument: 'Niveau de travail', reglage: "2210 mm", action: 'fermeture de la vanne d’appoint SER LCV001 / LCV002' },
                                                { instrument: 'LSL001', reglage: "2110 mm", action: 'Ouverture vanne d’appoint SER LCV001 / LCV002' },
                                                { instrument: 'LSLL001', reglage: "750 mm", action: 'Alarme Niveau trés bas' },
                                            ],
                                        },
                                        conditionsDeclenchement: { create: [{ description: 'declanchement pompe CEX ,ou TVcc' }] },
                                        conditionsDemarrage: { create: [{ description: "niveau de travaille 610 mm" }] },
                                        conditionsFermeture: { create: [{ description: "Arret centrale" }] },
                                        conditionsManoeuvre: { create: [{ description: "refrigeration" }] },
                                        conditionsOuverture: { create: [{ description: "niveau de travaille" }] },
                                    },

                                    // Organe 5 : Groupe CAP
                                    {
                                        nomSpecifique: 'groupe CAP',
                                        nomCircuit: 'CAP',
                                        reference: 'CAP001',
                                        conditionsDemarrage: {
                                            create: {
                                                description: "✓ Pas de conditions de déclenchement",
                                            },
                                        },
                                        conditionsDeclenchement: {
                                            create: {
                                                description: "Niveau condenseur trés haut 1000 mm & commande individuelle",
                                            },
                                                                         
                                        },
                                        conditionsManoeuvre :{
                                            create :{
                                                description:" Capacité totale unitaire : 90 m³ = 3600 mm &  Capacité utile unitaire : 75 m³ = 3000 mm"
                                            }
                                        }
                                    },


                                    // Organe 3 : Pompe CEX (101PO/102PO)
                                    {
                                        nomSpecifique: 'Pompe CEX (101PO/102PO)',
                                        nomCircuit: 'CEX',
                                        reference: 'PMP001',
                                        conditionsDemarrage: {
                                            create: {
                                                description: "✓ Pas de conditions de déclenchement",
                                            },
                                        },
                                        conditionsDeclenchement: {
                                            create: {
                                                description: "✗ Arrêt d’urgence & Défaut électrique sur moteur & Température palier très haute (> 90°C) & Vibration très haute (4,5 mm/s) & Température enroulement moteur très haute (> 130°C) & Vanne d’aspiration non ouverte (fin de course) & Vanne de refoulement non ouverte pendant 1 minute & Vanne de refoulement fermée pendant 5 secondes",
                                            },
                                        },
                                    },
                                ]
                            },


                            alarmes: {
                                create: [
                                    {
                                        nom: 'B0 + CEX + Température paliers',
                                        description: 'Alarme et déclenchement pour température paliers',
                                        Parametre:{
                                            create:[
                                                {
                                                    nom: "LLHH001",
                                                    description: ''
                                                },
                                               ]},
                                        consequence: 'Déclenchement de la pompe CEX',
                                        instruction: {
                                            create: [
                                                { ordre: 1, description: 'Vérifier la température des paliers' },
                                                { ordre: 2, description: 'Arrêter la pompe CEX si la température dépasse 90°C' },
                                            ],
                                        },
                                    },
                                    {
                                        nom: 'B0 + CEX + Température enroulement',
                                        description: 'Alarme et déclenchement pour température enroulement',
                                        Parametre: {
                                            create: [
                                                {
                                                    nom: "LLHH001",
                                                    description: ''
                                                },
                                                
                                            ]
                                        },                                        consequence: 'Déclenchement de la pompe CEX',
                                        instruction: {
                                            create: [
                                                { ordre: 1, description: 'Vérifier la température des enroulements' },
                                                { ordre: 2, description: 'Arrêter la pompe CEX si la température dépasse 130°C' },
                                            ],
                                        },
                                    },
                                    {
                                        nom: 'B0 + CEX + Vibration',
                                        description: 'Alarme et déclenchement pour vibration',
                                        Parametre: {
                                            create: [
                                                {
                                                    nom: "LLHH001",
                                                    description: ''
                                                },
                                                ]
                                        },
                                        consequence: 'Déclenchement de la pompe CEX',
                                        instruction: {
                                            create: [
                                                { ordre: 1, description: 'Vérifier les vibrations' },
                                                { ordre: 2, description: 'Arrêter la pompe CEX si les vibrations dépassent 4,5 mm/s' },
                                            ],
                                        },
                                    },
                                ],
                            },

                        },

                    ]





                },//cicuit






                //data
            },

        });

        console.log('Partie B0 et ses données créées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données:', error);
    }
}

main()
    .catch((e) => {
        console.error('Erreur non gérée:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });