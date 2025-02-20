
// /src/hooks/SpeechToText.tsx
"use client";
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function SpeechToText() {
    const { text, isListening, startListening, stopListening, handleTextInputChange } = useSpeechRecognition();
    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
    const [isClient, setIsClient] = useState(false); // Pour vérifier si nous sommes côté client

    // Vérification de la présence d'un client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fonction pour gérer la soumission de la question
    const handleSubmitQuestion = async () => {
        if (text && text.toLowerCase().startsWith("question")) {
            // Envoi de la question vers l'API pour rechercher une réponse
            const response = await fetch(`/api/questions?query=${text}`);
            const data = await response.json();

            if (data.response) {
                // Si une réponse est trouvée, rediriger vers la page de rapport
                alert("Réponse trouvée : " + data.response);
                new SpeechSynthesisUtterance(data.response);
                // Vous pouvez utiliser router.push() si vous avez un router Next.js
            } else {
                // Si aucune réponse n'est trouvée, signaler à l'utilisateur et activer le bouton d'enregistrement
                alert("Aucune réponse trouvée pour votre question.");
                setIsQuestionSubmitted(true); // Indiquer que la question peut être enregistrée
            }
        } else {
            alert("Le texte ne commence pas par 'question'.");
        }
    };

    // Si le composant n'est pas encore monté côté client, ne pas afficher l'interface
    if (!isClient) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">🗣️ Reconnaissance Vocale</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                    <strong>Texte reconnu :</strong>
                </p>
                <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                    {text || <span className="text-gray-400">Parle et vois le texte ici...</span>}
                </div>
            </div>

            {/* Boutons d'activation de la reconnaissance vocale */}
            <div className="mt-4 flex gap-4">
                <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                    🎤 Démarrer
                </button>
                <button
                    onClick={stopListening}
                    disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                >
                    ⏹️ Arrêter
                </button>
            </div>

            {/* Champ de saisie manuel */}
            <div className="mt-4 w-full max-w-lg">
                <label className="block text-gray-700">Saisir un texte manuellement :</label>
                <textarea
                    value={text} // Assurez-vous que `text` est utilisé ici pour afficher le texte
                    onChange={handleTextInputChange} // Utilisation de `handleTextInputChange` pour gérer le changement
                    className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                    placeholder="Tapez votre texte ici..."
                    rows={4} // Vous pouvez définir un nombre de lignes visibles
                />
            </div>

            {/* Bouton de soumission de la question */}
            <button
                onClick={handleSubmitQuestion}
                disabled={!text} // Désactiver si aucun texte n'est reconnu
                className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg ${isQuestionSubmitted ? "bg-yellow-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}
            >
                💾 Soumettre la question
            </button>
        </div>
    );
}


{/*}
// /src/hooks/SpeechToText.tsx
"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useState } from "react";

export default function SpeechToText() {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();
    const [isQuestion, setIsQuestion] = useState(false); // État pour savoir si c'est une question

    const handleStopListening = () => {
        stopListening();
        // Vérifier si la transcription commence par "question"
        if (text.toLowerCase().startsWith("question")) {
            setIsQuestion(true);
        } else {
            setIsQuestion(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">🗣️ Reconnaissance Vocale</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700"><strong>Texte reconnu :</strong></p>
                <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                    {text || <span className="text-gray-400">Parle et vois le texte ici...</span>}
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                    🎤 Démarrer
                </button>
                <button
                    onClick={handleStopListening}
                    disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                >
                    ⏹️ Arrêter
                </button>
            </div>
        </div>
    );
}


{/*}
// /src/hooks/SpeechToText.tsx

"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function SpeechToText() {
    const { text, isListening, startListening, stopListening } =
        useSpeechRecognition();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">🗣️ Reconnaissance Vocale</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                    <strong>Texte reconnu :</strong>
                </p>
                <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                    {text || <span className="text-gray-400">Parle et vois le texte ici...</span>}
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                        }`}
                >
                    🎤 Démarrer
                </button>
                <button
                    onClick={stopListening}
                    disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        }`}
                >
                    ⏹️ Arrêter
                </button>
            </div>
        </div>
    );
}
*/}
