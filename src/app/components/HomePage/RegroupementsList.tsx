//src/app/components/HomePage/RegroupementsList.tsx

import React from "react";

// Définir le type Regroupement
type Regroupement = {
    nom: string;
};

// Props du composant
type RegroupementsListProps = {
    regroupements: Regroupement[];
};

const RegroupementsList: React.FC<RegroupementsListProps> = ({ regroupements }) => {
    return (
        <ul className="space-y-2">
            {regroupements.map((regroupement) => (
                <li key={regroupement.nom} className="p-2 bg-gray-100 rounded-lg">
                    {regroupement.nom}
                </li>
            ))}
        </ul>
    );
};

export default RegroupementsList;