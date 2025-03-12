// components/HomePage/NiveauxList.tsx
import React from "react";

interface Niveau {
    id: string | number;
    instrument: string;
    reglage: string;
    action: string;
}

interface NiveauxListProps {
    niveaux: Niveau[];
}

const NiveauxList: React.FC<NiveauxListProps> = ({ niveaux }) => {
    if (niveaux.length === 0) {
        return <p>Aucun réglage à afficher.</p>;
    }

    return (
        <ul className="space-y-2">
            {niveaux.map((niveau) => (
                <li key={niveau.id} className="p-2 bg-gray-100 rounded-lg">
                    <strong>{niveau.instrument}</strong>: {niveau.reglage} - {niveau.action}
                </li>
            ))}
        </ul>
    );
};

export default NiveauxList;