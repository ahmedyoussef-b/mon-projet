"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//prisma/seed.ts
var client_1 = require("@prisma/client");
var donnees_1 = require("./donnees"); // Importation des données
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var circuit, organe, parametre, _i, donnees_2, donnee, valeur, motCle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.circuit.create({
                        data: {
                            label: "CEX",
                            description: "Eau d'extraction",
                        },
                    })];
                case 1:
                    circuit = _a.sent();
                    console.log("Circuit créé :", circuit);
                    return [4 /*yield*/, prisma.organe.create({
                            data: {
                                label: "Condenseur",
                                description: "Condenseur du circuit CEX",
                                circuitId: circuit.id, // Relation avec le circuit
                            },
                        })];
                case 2:
                    organe = _a.sent();
                    console.log("Organe créé :", organe);
                    return [4 /*yield*/, prisma.parametre.create({
                            data: {
                                label: "Niveau",
                                description: "Niveau du condenseur",
                                organeId: organe.id, // Relation avec l'organe
                            },
                        })];
                case 3:
                    parametre = _a.sent();
                    console.log("Paramètre créé :", parametre);
                    _i = 0, donnees_2 = donnees_1.donnees;
                    _a.label = 4;
                case 4:
                    if (!(_i < donnees_2.length)) return [3 /*break*/, 8];
                    donnee = donnees_2[_i];
                    return [4 /*yield*/, prisma.valeur.create({
                            data: {
                                valeur: donnee.reglage || "N/A",
                                action: donnee.action,
                                instrument: donnee.instrument || null,
                                parametreId: parametre.id, // Relation avec le paramètre
                            },
                        })];
                case 5:
                    valeur = _a.sent();
                    console.log("Valeur créée :", valeur);
                    if (!donnee.reglage) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.motCle.create({
                            data: {
                                mot: "niveau condenseur ".concat(donnee.reglage),
                                parametreId: parametre.id, // Relation avec le paramètre
                            },
                        })];
                case 6:
                    motCle = _a.sent();
                    console.log("Mot-clé créé :", motCle);
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("Erreur :", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
{ /*}
import { PrismaClient } from '@prisma/client';
import { donnees } from './donnees'; // Importez les données

const prisma = new PrismaClient();

async function main() {
    // Étape 1 : Insérer un circuit
    const circuit = await prisma.circuit.create({
        data: {
            label: "CEX",
            description: "Eau d'extraction",
        },
    });
    console.log("Circuit créé :", circuit);

    // Étape 2 : Insérer un organe
    const organe = await prisma.organe.create({
        data: {
            label: "Condenseur",
            description: "Condenseur du circuit CEX",
            circuit: {
                connect: { id: circuit.id },
            },
        },
    });
    console.log("Organe créé :", organe);

    // Étape 3 : Insérer un paramètre
    const parametre = await prisma.parametre.create({
        data: {
            label: "Niveau",
            description: "Niveau du condenseur",
            organe: {
                connect: { id: organe.id },
            },
        },
    });
    console.log("Paramètre créé :", parametre);

    // Étape 4 : Insérer les valeurs
    for (const donnee of donnees) {
        const valeur = await prisma.valeur.create({
            data: {
                valeur: donnee.reglage || "N/A",
                action: donnee.action,
                instrument: donnee.instrument || null,
                parametre: {
                    connect: { id: parametre.id },
                },
            },
        });
        console.log("Valeur créée :", valeur);

        // Étape 5 : Insérer les mots-clés
        if (donnee.reglage) {
            const motCle = await prisma.motCle.create({
                data: {
                    mot: `niveau condenseur ${donnee.reglage}`,
                    parametre: {
                        connect: { id: parametre.id },
                    },
                },
            });
            console.log("Mot-clé créé :", motCle);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
    */
}
