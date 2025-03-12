//src/app/components/HomePage/ReglageList.tsx
import React from "react";

// Définir le type Reglage
type Reglage = {
    id: number;
    instrument: string;
    reglage: string;
    action: string;
    organeId: number;
    organe: {
        id: number;
        nomSpecifique: string;
        nomCircuit: string;
        reference: string;
        // ... autres propriétés
    };
};

// Props du composant
type ReglagesListProps = {
    reglages: Reglage[];
};

const ReglagesList: React.FC<ReglagesListProps> = ({ reglages }) => {
    if (!reglages || reglages.length === 0) {
        return <p>Aucun réglage à afficher.</p>;
    }

    return (
        <ul className="space-y-2">
            {reglages.map((reglage) => (
                <li key={reglage.id} className="p-2 bg-gray-100 rounded-lg">
                    <strong>{reglage.instrument}</strong>: {reglage.reglage} - {reglage.action}
                </li>
            ))}
        </ul>
    );
};

export default ReglagesList;