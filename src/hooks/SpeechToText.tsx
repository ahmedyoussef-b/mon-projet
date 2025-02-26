// /src/hooks/SpeechToText.tsx
"use client";

import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function SpeechToText() {
    const { text, isListening, startListening, stopListening, handleTextInputChange, saveResponse,handleTextResponseInputChange,textreponse } = useSpeechRecognition();
    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [manualText, setManualText] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);
  //  const [isBlinking, setIsBlinking] = useState(false); // État pour le clignotement



    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSearchResponse = async () => {
        setIsSearching(true);
        if (text.toLowerCase().startsWith("question")) {
            try {
                const res = await fetch('/api/question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: text }),
                });

                if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

                const data = await res.json();
                if (data.reponse) {
                    setResponse(data.reponse);
                    alert("Réponse trouvée : " + data.reponse);

                    console.log(data.reponse)
                    const speech = new SpeechSynthesisUtterance(data.reponse);
                    window.speechSynthesis.speak(speech);
                } else {
                    alert("Aucune réponse trouvée.");
                    setIsQuestionSubmitted(true);
                }
            } catch (error) {
                console.error("Erreur API:", error);
                alert("Une erreur est survenue.");
            }
        } else {
            alert("Le texte doit commencer par 'question'.");
        }
        setIsSearching(false);
    };

    const handleTransferToSpeechToDatabase = () => {
        if (text) {
            setManualText(text);  // Mettre à jour le texte dans la deuxième colonne
       ///     setIsBlinking(true);  // Activer le clignotement
            setIsQuestionSubmitted(false);  // Réinitialiser l'état de la question soumise

            // Vérifier si la question existe déjà dans la base de données
            const isExistingQuestion = response && response.trim() !== "";

            if (isExistingQuestion) {
                // Si la question existe, associer la réponse à cette question
                fetch("/api/reponse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: text, reponse: manualText }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            saveResponse()
                            alert("Réponse enregistrée avec succès !");
                        } else {
                            alert("Échec de l'enregistrement de la réponse.");
                        }
                    })
                    .catch(error => {
                        console.error("Erreur lors de l'enregistrement de la réponse :", error);
                        alert("Une erreur est survenue lors de l'enregistrement.");
                    });
            } else {
                alert("Veuillez soumettre d'abord une question.");
                
            }

            // Prononcer le message vocal
            const speech = new SpeechSynthesisUtterance("Ahmed, tu veux enregistrer une réponse pour cette question ?");
            window.speechSynthesis.speak(speech);
        }
    };

    if (!isClient) return null;

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
                <button onClick={startListening} disabled={isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}>
                    🎤 Démarrer
                </button>
                <button onClick={stopListening} disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}>
                    ⏹️ Arrêter
                </button>
            </div>

            <div className="mt-4 w-full max-w-lg">
                <label className="block text-gray-700">Saisir un texte manuellement :</label>
                <textarea
                    value={text}
                    onChange={handleTextInputChange}
                    className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                    placeholder="Tapez votre texte ici..."
                    rows={4}
                />
            </div>

            <div className="mt-4 flex gap-4">
                <button onClick={handleSearchResponse} disabled={isQuestionSubmitted || !text || isSearching}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isSearching ? "bg-yellow-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}>
                    🔍 Rechercher la réponse
                </button>
                <button onClick={handleTransferToSpeechToDatabase} disabled={!text}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!response ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}>
                    ➡️ Transférer la question
                </button>
            </div>

            {isQuestionSubmitted && (
                <div className="mt-4 text-green-600">
                    La question a été soumise avec succès !
                </div>
            )}

            {response && (
                <div className="mt-4 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                    <p className="text-gray-700"><strong>Réponse trouvée :</strong></p>
                    <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                        {response}
                    </div>
                </div>
            )}
{/*}
            <SpeechToDatabase
                question={text}
                manualText={manualText}
                setManualText={setManualText}
                isBlinking={isBlinking}
                setIsBlinking={setIsBlinking}
            />
       */}
            </div>
    );
}

