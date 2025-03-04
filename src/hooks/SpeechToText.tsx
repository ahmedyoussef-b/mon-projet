// /src/hooks/SpeechToText.tsx
import { useState, useRef, useCallback, useEffect } from "react";

// Déclarer les types pour SpeechRecognition
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export function useSpeechToText(onSubmit: (text: string) => void) {
    const [text, setText] = useState(""); // Texte saisi (voix ou manuel)
    const [isListening, setIsListening] = useState(false); // Mode écoute activé ou non
    const [error, setError] = useState<string | null>(null); // Gestion des erreurs

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Fonction pour arrêter l'écoute
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    // Fonction pour démarrer l'écoute
    const startListening = useCallback(() => {
        if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
            setError("La reconnaissance vocale n'est pas supportée par votre navigateur.");
            return;
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();

        if (!recognitionRef.current) {
            setError("Erreur lors de l'initialisation de la reconnaissance vocale.");
            return;
        }

        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "fr-FR";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            setText(transcript); // Mettre à jour le texte avec la transcription

            // Vérifier si le mot "répond" est dans la transcription
            if (transcript.toLowerCase().includes("répond")) {
                // Soumettre immédiatement si "répond" est prononcé
                onSubmit(transcript);
            }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Erreur de reconnaissance vocale :", event.error);
            setError("Erreur lors de la reconnaissance vocale.");
            stopListening();
        };

        recognitionRef.current.start();
        setIsListening(true);
        setError(null); // Réinitialiser les erreurs
    }, [onSubmit, stopListening]);

    // Fonction pour gérer la saisie manuelle
    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }, []);

    useEffect(() => {
        const recognition = recognitionRef.current;
        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    return {
        text,
        isListening,
        error,
        startListening,
        stopListening,
        handleTextChange,
    };
}

{/*}
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SpeechToDatabase from "@/components/SpeechToDatabase";

// Définir une interface pour la structure des réponses de l'API
interface ApiResponse {
    content: string;
    responses: {
        content: string;
        createdAt?: string; // Optionnel, car il peut être ajouté manuellement
    }[];
}

export default function SpeechToText() {
    const router = useRouter(); // Initialisation de useRouter
    const [isClient, setIsClient] = useState(false); // État pour vérifier si le composant est côté client

    const {
        text,
        isListening,
        startListening,
        stopListening,
        handleTextInputChange,
    } = useSpeechRecognition();

    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null);
    const [manualText, setManualText] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isBlinking, setIsBlinking] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true); // Marquer que le composant est rendu côté client
    }, []);

    async function handleSearchResponse(question: string, filter: unknown = null, page: number = 1, limit: number = 10) {
        setIsSearching(true);
        if (text.toLowerCase().startsWith("question")) {
            try {
                // Appel à l'API pour obtenir la réponse
                const apiResponse = await fetch("/api/question", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question: text, filter, page, limit }),
                });

                if (!apiResponse.ok) throw new Error(`Erreur ${apiResponse.status}: ${apiResponse.statusText}`);

                const apiData: ApiResponse = await apiResponse.json(); // Utilisation de l'interface ApiResponse
                setResponse(apiData.content); // Stocker la réponse de l'API

                if (apiData.responses.length === 0) {
                    console.log("Aucune réponse disponible pour cette question.");
                    const speech = new SpeechSynthesisUtterance(`Aucune réponse disponible pour cette question`);
                    speech.onerror = (event) => {
                        console.error("Erreur lors de la synthèse vocale :", event.error);
                    };
                    window.speechSynthesis.speak(speech);
                    setManualText(text);
                    setIsBlinking(true);
                    setIsQuestionSubmitted(false);
                } else if (apiData.responses.length === 1) {
                    console.log("Réponse unique :", apiData.responses[0]);
                    const speech = new SpeechSynthesisUtterance(`une reponse`);
                    window.speechSynthesis.speak(speech);

                    // Préparer la réponse pour la base de données
                    const databaseResponse = {
                        content: apiData.responses[0].content,
                        createdAt: apiData.responses[0].createdAt || new Date().toISOString(),
                    };

                    // Stocker la réponse dans la base de données
                    const storeRes = await fetch("/api/store-responses", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ responses: [databaseResponse] }),
                    });

                    console.log("Réponse stockée :", databaseResponse);

                    if (!storeRes.ok) throw new Error("Erreur lors du stockage de la réponse unique");

                    const { id } = await storeRes.json();
                    router.push(`/rapports?id=${id}`);
                } else {
                    console.log("Plusieurs réponses disponibles :");
                    const speech = new SpeechSynthesisUtterance(`une séquence d'étapes`);
                    window.speechSynthesis.speak(speech);

                    // Préparer les réponses pour la base de données
                    const databaseResponses = apiData.responses.map((res) => ({
                        content: res.content,
                        createdAt: res.createdAt || new Date().toISOString(),
                    }));

                    // Stocker les réponses dans la base de données
                    const storeRes = await fetch("/api/store-responses", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ responses: databaseResponses }),
                    });
                    console.log("Réponses stockées :", databaseResponses);

                    if (!storeRes.ok) throw new Error("Erreur lors du stockage des réponses");

                    const { id } = await storeRes.json();
                    router.push(`/rapports?id=${id}`);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des réponses :", (error as Error).message);
            }
        } else {
            alert("Le texte doit commencer par 'question'.");
        }
        setIsSearching(false);
    }

    if (!isClient) return null; // Ne rien rendre côté serveur

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
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
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                >
                    🎤 Démarrer
                </button>
                <button
                    onClick={stopListening}
                    disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
                >
                    ⏹️ Arrêter
                </button>
            </div>

            {!isListening && (
                <div className="mt-4 w-full max-w-lg">
                    <label className="block text-gray-100">Saisir un texte manuellement :</label>
                    <textarea
                        value={text}
                        onChange={handleTextInputChange}
                        className="w-full mt-2 p-3 border text-slate-950 border-gray-300 rounded-md"
                        placeholder="Tapez votre texte ici..."
                        rows={4}
                    />
                </div>
            )}

            <div className="mt-4 flex gap-4">
                <button
                    onClick={() => handleSearchResponse(text)}
                    disabled={isQuestionSubmitted || !text || isSearching}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isSearching ? "bg-yellow-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    🔍 Rechercher la réponse
                </button>
                {/*
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

            <SpeechToDatabase
                question={text}
                manualText={manualText}
                setManualText={setManualText}
                isBlinking={isBlinking}
                setIsBlinking={setIsBlinking}
            />
        </div>
    );
}
*/}