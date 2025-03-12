//src/app/components/HomePage/CondiltionList.tsx
import React from "react";
import { Condition } from "@/app/types/types";

interface ConditionsListProps {
    conditions: Condition[] | null; // Permet à `conditions` d'être `null`
}

const ConditionsList: React.FC<ConditionsListProps> = ({ conditions }) => {
    // Si `conditions` est null ou undefined, affichez un message d'erreur ou un état vide
    if (!conditions) {
        return <div className="text-red-500">Aucune condition trouvée.</div>;
    }

    // Si `conditions` est un objet, le transformer en tableau
    let conditionsArray: Condition[] = [];
    if (typeof conditions === "object" && !Array.isArray(conditions)) {
        conditionsArray = Object.values(conditions).filter(
            (item) => item && typeof item === "object" && "id" in item
        ) as Condition[];
    } else if (Array.isArray(conditions)) {
        conditionsArray = conditions;
    }

    // Si `conditionsArray` est un tableau vide, affichez un message approprié
    if (conditionsArray.length === 0) {
        return <div className="text-gray-500">Aucune condition disponible.</div>;
    }

    console.log("conditionlist", conditionsArray);

    return (
        <ul>
            {conditionsArray.map((condition) => (
                <li key={condition.id} className="mb-2">
                    <h3 className="text-xl font-bold">{condition.description}</h3>
                    <p>{condition.organe.nomSpecifique}</p>
                </li>
            ))}
        </ul>
    );
};

export default ConditionsList;