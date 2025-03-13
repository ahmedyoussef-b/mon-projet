//src/app/types/types.ts
import {  Organe } from "@prisma/client";

// types/types.ts
export interface Reglage {
    id: number;
    nom:string;
    instrument: string;
    reglage: string;
    action: string;
    description: string;
    organeId: number;
organe:{
    id: number;
    nomSpecifique: string;
    nomCircuit: string;
    reference: string;
   
}
}

export interface Regroupement {
    id: number;
    nom: string;
    niveaux: Reglage[];
}

export interface Condition {
    id: number;
    description: string;
    organe: Organe;
    nomSpecifique: string;
    niveau: string;
}

export interface Alarme {
    id: number;
    nom: string;
    description: string;
    organe: Organe;
    nomSpecifique: string;
    consequence:string;
    instruction: Instruction[];
    Parametre:Parametre[]
}

interface Instruction {
    description: string;
    ordre: number; // Ajoutez cette propriété
}

interface Parametre {
    nom: string;
    description: string;
}

export type ReglageDetailType = Reglage;
export type ReglagesListType = Reglage[];
export type RegroupementsListType = Regroupement[];
export type ConditionsListType = Condition[];
export type AlarmesListType = Alarme[];

