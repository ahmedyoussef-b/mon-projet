//src/app/components/HomePage/AlarmManagement.tsx
"use client";

import React, { useState } from "react";
import AlarmModal from "./AlarmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AlarmManagementProps {
    selectedAlarme: string | null;
    onClose: () => void;
    alarmModalData: {
        message: string;
        actions: string[];
        suggestion?: { mot: string };
    } | null;
}

const AlarmManagement = ({ selectedAlarme, onClose, alarmModalData }: AlarmManagementProps) => {
    const [showActionButtons, setShowActionButtons] = useState(false);

    const handleAlarmAction = async (action: string, newMotCle?: string) => {
        if (!selectedAlarme) return;

        try {
            let response;
            switch (action) {
                case "ajouter":
                    response = await fetch("/api/alarme/ajouter", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nom: selectedAlarme,
                            description: "Description à définir",
                            instruction: [],
                            consequence: "Conséquence à définir",
                            circuitId: 1,
                            parametres: [],
                        }),
                    });
                    break;
                case "supprimer":
                    response = await fetch("/api/alarme/supprimer", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nom: selectedAlarme }),
                    });
                    break;
                case "corriger":
                    if (!newMotCle) {
                        toast.error("Veuillez fournir un nouveau mot-clé pour la correction.");
                        return;
                    }
                    response = await fetch("/api/alarme/modifier", {
                        method: "PUT", // Utilisez PUT
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ancienNom: selectedAlarme, nouveauNom: newMotCle }),
                    });
                    break;
                default:
                    return;
            }

            if (!response.ok) {
                const errorText = await response.text(); // Lire la réponse comme texte
                console.error("Erreur API :", errorText);
                throw new Error(errorText || "Erreur lors de l'action");
            }

            const result = await response.json(); // Parser la réponse en JSON
            toast.success(result.message);
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'action :", error);
            toast.error( "Une erreur s'est produite.");
        }
    };

    return (
        <>
            <button
                onClick={() => setShowActionButtons(!showActionButtons)}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                {showActionButtons ? "Masquer les actions" : "Afficher les actions"}
            </button>
            {showActionButtons && (
                <div className="flex space-x-4 mt-4">
                    <button
                        onClick={() => handleAlarmAction("ajouter")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Ajouter
                    </button>
                    <button
                        onClick={() => handleAlarmAction("supprimer")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Supprimer
                    </button>
                    <button
                        onClick={() => handleAlarmAction("corriger")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Corriger
                    </button>
                </div>
            )}
            {alarmModalData && (
                <AlarmModal
                    isOpen={!!alarmModalData}
                    onClose={onClose}
                    message={alarmModalData.message}
                    actions={alarmModalData.actions}
                    onAction={handleAlarmAction}
                />
            )}
            <ToastContainer />
        </>
    );
};

export default AlarmManagement;