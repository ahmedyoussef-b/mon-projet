// /src/hooks/SpeechToDatabase.tsx
"use client";

import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type SpeechToDatabaseProps = {
    question: string | null; // Propriété disponible pour une utilisation future
    manualText: string;
    setManualText: (text: string) => void;
    isBlinking: boolean;
    setIsBlinking: (isBlinking: boolean) => void;
};

export default function SpeechToDatabase({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    question, // Propriété conservée pour une utilisation future
    manualText,
    setManualText,
    isBlinking,
    setIsBlinking,
}: SpeechToDatabaseProps) {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();
    const [mode, setMode] = useState<"question" | "reponse">("question");
    const [response, setResponse] = useState<string | null>(null);
    //const [isQuestionSaved, setIsQuestionSaved] = useState(false);
    const [firstColumnText, setFirstColumnText] = useState<string>(""); // Question à enregistrer
    const [isRecording, setIsRecording] = useState(false);
    const [questionId, setQuestionId] = useState<string | null>(null); // ID de la question
    const [error, setError] = useState<string | null>(null); // Gestion des erreurs
    const [questionExists, setQuestionExists] = useState(false); // True si la question existe

    // Récupérer la question en attente depuis le localStorage
    useEffect(() => {
        const pendingQuestion = localStorage.getItem("pendingQuestion");
        if (pendingQuestion) {
            setFirstColumnText(pendingQuestion);
            localStorage.removeItem("pendingQuestion");
        }
    }, []);

    // Mettre à jour le texte reconnu
    useEffect(() => {
        if (text) {
            if (mode === "question") {
                setFirstColumnText(text); // Mettre à jour la question
            } else if (mode === "reponse") {
                setManualText(text); // Mettre à jour la réponse
            }
        }
    }, [text, mode, setManualText]);

    // Démarrer l'enregistrement
    const handleStartListening = (newMode: "question" | "reponse") => {
        setMode(newMode);
        setIsRecording(true);
        startListening();
    };

    // Arrêter l'enregistrement
    const handleStopListening = () => {
        stopListening();
        setIsRecording(false);
    };

    // Soumettre la question ou la réponse
    const handleSubmit = async () => {
        setError(null); // Réinitialiser l'erreur

        if (mode === "question") {
            if (!firstColumnText || firstColumnText.trim().length < 5) {
                setError("Veuillez poser une question valide (au moins 5 caractères).");
                return;
            }

            try {
                const response = await fetch("/api/question", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: firstColumnText }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erreur lors de la recherche de la réponse.");
                }

                const data = await response.json();
                setQuestionExists(true); // La question existe maintenant
                setQuestionId(data.id); // Enregistrer l'ID de la question

                if (data.responses && data.responses.length > 0 && data.responses[0].content) {
                    setResponse(data.responses[0].content); // Afficher la première réponse
                } else {
                    setError("Aucune réponse trouvée. Vous pouvez enregistrer une réponse.");
                }
            } catch (error) {
                console.error("Erreur API:", error);
                setError(error instanceof Error ? error.message : "Une erreur est survenue lors de la recherche de la réponse.");
            }
        } else if (mode === "reponse") {
            if (!manualText || manualText.trim().length < 5) {
                setError("Veuillez entrer une réponse valide (au moins 5 caractères).");
                return;
            }

            if (!questionId) {
                setError("Aucune question associée trouvée. Veuillez d'abord soumettre une question.");
                return;
            }

            try {
                const res = await fetch("/api/reponse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        questionId: questionId, // ID de la question
                        reponse: manualText, // Réponse saisie
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erreur lors de l'enregistrement de la réponse.");
                }

                const data = await res.json();
                setResponse(data.reponse); // Mettre à jour la réponse
                setIsBlinking(false); // Désactiver le clignotement
                setError(null); // Réinitialiser l'erreur

                // Réinitialiser les champs
                setFirstColumnText("");
                setManualText("");
                setQuestionId(null);
            } catch (error) {
                console.error("Erreur API:", error);
                setError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de la réponse.");
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 bg-slate-600 min-h-screen w-full">
            <h1 className="text-2xl font-bold mb-4">🎙️ Enregistrement</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700"><strong>Texte reconnu ou saisi :</strong></p>
                <textarea
                    value={firstColumnText}
                    onChange={(e) => setFirstColumnText(e.target.value)}
                    className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md min-h-[80px]"
                    placeholder="Parle ou écris ici..."
                />
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={() => handleStartListening("question")}
                    disabled={isListening || isRecording || questionExists} // Désactivé si la question existe
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    🎤 Démarrer Question
                </button>
                <button
                    onClick={() => handleStartListening("reponse")}
                    disabled={isListening || !questionExists || isRecording} // Désactivé si la question n'existe pas
                    className={`px-4 py-2 text-white rounded-lg hover:bg-green-600 ${isBlinking ? "bg-green-500 animate-pulse" : "bg-green-500"}`}
                >
                    🎤 Démarrer Réponse
                </button>
                <button
                    onClick={handleStopListening}
                    disabled={!isListening || !isRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    ⏹️ Arrêter
                </button>
            </div>

            <div className="mt-6 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {response ? (
                    <p className="text-gray-700"><strong>Réponse trouvée :</strong> {response}</p>
                ) : (
                    <div>
                        <label className="block text-gray-700">Saisir une réponse manuellement :</label>
                        <textarea
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                            placeholder="Entrez votre réponse ici..."
                            rows={4}
                        />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={!manualText || isRecording || (mode === "reponse" && !questionExists)} // Désactivé si la question n'existe pas en mode réponse
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                    💾 Soumettre / Sauvegarder
                </button>
            </div>
        </div>
    );
}
{/*
"use client";

import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type SpeechToDatabaseProps = {
    question: string | null;
    manualText: string;
    setManualText: (text: string) => void;
    isBlinking: boolean;
    setIsBlinking: (isBlinking: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SpeechToDatabase({ question, manualText, setManualText, isBlinking, setIsBlinking }: SpeechToDatabaseProps) {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();
    const [mode, setMode] = useState<"question" | "reponse">("question");
    const [response, setResponse] = useState<string | null>(null);
    const [isQuestionSaved, setIsQuestionSaved] = useState(false);
    const [firstColumnText, setFirstColumnText] = useState<string>(""); // Question à enregistrer
    const [isRecording, setIsRecording] = useState(false);
    const [questionId, setQuestionId] = useState<string | null>(null); // ID de la question

    useEffect(() => {
       const pendingQuestion = localStorage.getItem("pendingQuestion");
        if (pendingQuestion) {
           setFirstColumnText(pendingQuestion);
          localStorage.removeItem("pendingQuestion");
        }
    }, []);

    useEffect(() => {
        if (text) {
            if (mode === "question") {
                setFirstColumnText(text); // Mettre à jour la question
            } else if (mode === "reponse") {
                setManualText(text); // Mettre à jour la réponse
            }
        }
    }, [text, mode, setManualText]);

    const handleStartListening = (newMode: "question" | "reponse") => {
        setMode(newMode);
        setIsRecording(true);
        startListening();
    };

    const handleStopListening = () => {
        stopListening();
        setIsRecording(false);
    };

    const handleSubmit = async () => {
        if (mode === "question") {
            if (firstColumnText && firstColumnText.trim().length > 0) {
                try {
                    const response = await fetch("/api/question", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: firstColumnText }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Erreur lors de la recherche de la réponse.");
                    }

                    const data = await response.json();
                    if (data.response) {
                        setResponse(data.response); // Réponse trouvée
                        setQuestionId(data.id); // Enregistrer l'ID de la question
                    } else {
                        alert("Aucune réponse trouvée. Vous pouvez enregistrer cette question.");
                        setIsQuestionSaved(true);
                    }
                } catch (error) {
                    console.error("Erreur API:", error);
                    alert("Une erreur est survenue lors de la recherche de la réponse.");
                }
            } else {
                alert("Veuillez poser une question valide !");
            }
        } else if (mode === "reponse") {
            if (!manualText || manualText.trim().length < 5) {
                alert("Veuillez entrer une réponse valide (au moins 5 caractères).");
                return;
            }

            if (!questionId) {
                alert("Aucune question associée trouvée. Veuillez d'abord soumettre une question.");
                return;
            }

            try {
                const res = await fetch("/api/reponse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        questionId: questionId, // ID de la question
                        reponse: manualText,     // Réponse saisie
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erreur lors de l'enregistrement de la réponse.");
                }

                const data = await res.json();
                alert(data.message || "Réponse enregistrée avec succès !");
                setIsBlinking(false); // Désactiver le clignotement
                setResponse(data.reponse); // Mettre à jour la réponse

                // Réinitialiser les champs
                setFirstColumnText("");
                setManualText("");
                setQuestionId(null); // Réinitialiser l'ID de la question
            } catch (error) {
                console.error("Erreur API:", error);
                alert(error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de la réponse.");
            }
        }
    };

    return (
        <div className=" flex-col justify-center  items-center p-4 bg-slate-600 min-h-screen w-max">
            <h1 className="text-2xl font-bold mb-4">🎙️ Enregistrement</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700"><strong>Texte reconnu ou saisi :</strong></p>
                <textarea
                    value={firstColumnText}
                    onChange={(e) => setFirstColumnText(e.target.value)}
                    className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md min-h-[80px]"
                    placeholder="Parle ou écris ici..."
                />
            </div>

           <div className="mt-4 flex gap-4">
              <button onClick={() => handleStartListening("question")} disabled={isListening || isRecording}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">🎤 Démarrer Question</button>
                <button onClick={() => handleStartListening("reponse")} disabled={isListening || !isQuestionSaved || isRecording}
                    className={`px-4 py-2 text-white rounded-lg hover:bg-green-600 ${isBlinking ? "bg-green-500 animate-pulse" : "bg-green-500"}`}>
                    🎤 Démarrer Réponse
                </button>
                <button onClick={handleStopListening} disabled={!isListening || !isRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">⏹️ Arrêter</button>
            </div>

         
            <div className="mt-6 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                {response ? (
                    <p className="text-gray-700"><strong>Réponse trouvée :</strong></p>
                ) : (
                    <div>
                        <label className="block text-gray-700">Saisir une réponse manuellement :</label>
                        <textarea
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                            placeholder="Entrez votre réponse ici..."
                            rows={4}
                        />
                    </div>
                )}

                <button onClick={handleSubmit} disabled={!manualText || isRecording} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                    💾 Soumettre / Sauvegarder
                </button>
            </div>
        </div>
    );
}

*/}