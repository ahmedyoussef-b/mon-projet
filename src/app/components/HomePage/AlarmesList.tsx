import React from "react";
import { Alarme } from "@/app/types/types";

interface AlarmesListProps {
    alarmes: Alarme[];
}

const AlarmesList: React.FC<AlarmesListProps> = ({ alarmes }) => (
    <ul>
        {alarmes.map((alarme) => (
            <li key={alarme.nom} className="mb-2">
                <h3 className="text-xl font-bold">{alarme.nom}</h3>
                <p>{alarme.description}</p>
            </li>
        ))}
    </ul>
);

export default AlarmesList;