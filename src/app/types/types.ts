//src/app/types/types.ts
import { Organe, Parametre } from "@prisma/client";

// types/types.ts
export interface Reglage {
  instructions: string;
    id: number;
    nom:string;
    instrument: string;
    reglage: string;
    action: string;
    description:string
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
    instructions:[];
    Parametre:Parametre[]
}



export type ReglageDetailType = Reglage;
export type ReglagesListType = Reglage[];
export type RegroupementsListType = Regroupement[];
export type ConditionsListType = Condition[];
export type AlarmesListType = Alarme[];

{/*}
import { Organe } from "@prisma/client";

// types/types.ts
export interface Reglage {
    id: number;
    instrument: string;
    reglage: string;
    action: string;
   
}
export interface niveauInferieur{
    id :number;
    nom :string
    instrument: string;
    reglage: string;
    action: string;
}

export interface niveauSuperieur{
    id: number;
    nom :string;
    instrument: string;
    reglage: string;
    action: string;
}
export interface Regroupement {
    id: number;
    nom: string;
    niveaux: ReglageDetailType[];
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
}
// Définir les types manquants
export type ReglageDetailType = {
  id:number;
  reglage: string;
  action: string;
  instrument: string;
    
};

export type ReglagesListType = ReglageDetailType[];
export type RegroupementsListType = Regroupement[];

export type ConditionsListType = Condition[]
export type AlarmesListType = Alarme[]
*/}