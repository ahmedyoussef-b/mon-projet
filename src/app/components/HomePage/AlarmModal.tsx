//src/app/components/HomePage/AlarmModal.tsx
import React, { useState } from "react";
interface AlarmModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    actions: string[];
    onAction: (action: string, newMotCle?: string) => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
    isOpen,
    onClose,
    message,
    actions,
    onAction,
}) => {
    const [newMotCle, setNewMotCle] = useState("");
    console.log("isOpen", isOpen)
    console.log("onClose", onClose)
    console.log("message", message)
    console.log("actions", actions)
    console.log("onAction", onAction)
    console.log("newMotCle", newMotCle)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg mb-4">{message}</p>

                {/* Champ de saisie pour "Corriger" */}
                {actions.includes("corriger") && (
                    <div className="mb-4">
                        <input
                            type="text"
                            value={newMotCle}
                            onChange={(e) => setNewMotCle(e.target.value)}
                            placeholder="Nouveau mot-clé"
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                )}

                <div className="flex space-x-4">
                    {actions.includes("corriger") && (
                        <button
                            onClick={() => onAction("corriger", newMotCle)} // Passez newMotCle ici
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Corriger
                        </button>
                    )}
                    {actions.includes("ajouter") && (
                        <button
                            onClick={() => onAction("ajouter")}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                            Ajouter
                        </button>
                    )}
                    {actions.includes("supprimer") && (
                        <button
                            onClick={() => onAction("supprimer")}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                            Supprimer
                        </button>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
};
export default AlarmModal;
{/*}
"use client"

import React, { useState } from "react";
interface AlarmModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    actions: string[];
    onAction: (action: string, newMotCle?: string) => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
    isOpen,
    onClose,
    message,
    actions,
    onAction,
}) => {
    const [newMotCle, setNewMotCle] = useState("");
    console.log("isOpen", isOpen)
    console.log("onClose", onClose)
    console.log("message", message)
    console.log("actions", actions)
    console.log("onAction", onAction)
    console.log("newMotCle", newMotCle)



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{message}</h2>
                {actions.includes("corriger") && (
                    <div className="mb-4">
                        <input
                            type="text"
                            value={newMotCle}
                            onChange={(e) => setNewMotCle(e.target.value)}
                            placeholder="Nouveau mot-clé"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}
                <div className="flex gap-2">
                    {actions.map((action) => (
                        <button
                            key={action}
                            onClick={() => onAction(action, newMotCle)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {action}
                        </button>
                    ))}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlarmModal;
{*/}