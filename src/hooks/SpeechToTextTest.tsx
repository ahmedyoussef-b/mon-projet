// /src/hooks/SpeechToText.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SpeechToDatabase from "@/components/SpeechToDatabase";

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
                const res = await fetch("/api/question", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question: text, filter, page, limit }),
                });

                if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

                const data = await res.json();
                setResponse(data.content);

                if (data.responses.length === 0) {
                                    console.log("Aucune réponse disponible pour cette question.");
                    const speech = new SpeechSynthesisUtterance(`Aucune réponse disponible pour cette question`);
                    speech.onerror = (event) => {
                        console.error("Erreur lors de la synthèse vocale :", event.error);
                    };
                    window.speechSynthesis.speak(speech);
                                    setManualText(text);
                                    setIsBlinking(true);
                                    setIsQuestionSubmitted(false);
                } else if (data.responses.length === 1) {
                    console.log("Réponse unique :", data.responses[0]);
                    const speech = new SpeechSynthesisUtterance(`une reponse`);
                    window.speechSynthesis.speak(speech);

                    // Ajouter createdAt si nécessaire
                    const responseToStore = {
                        content: data.responses[0].content,
                        createdAt: data.responses[0].createdAt || new Date().toISOString(), // Utiliser createdAt existant ou en ajouter un
                    };

                    // Stocker la réponse unique et obtenir un ID unique
                    const storeRes = await fetch("/api/store-responses", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ responses: [responseToStore] }), // Envoyer la réponse unique dans un tableau
                    });

                    console.log("StoreRes", responseToStore); // Afficher la réponse unique dans la console

                    if (!storeRes.ok) throw new Error("Erreur lors du stockage de la réponse unique");

                    const { id } = await storeRes.json();

                    // Rediriger vers la page Rapport avec l'ID
                    router.push(`/rapports?id=${id}`);
                } else {
                                    console.log("Plusieurs réponses disponibles :");
                                    const speech = new SpeechSynthesisUtterance(`une séquence d'étapes`);
                                    window.speechSynthesis.speak(speech);

                                    // Stocker les réponses et obtenir un ID unique
                                    const storeRes = await fetch("/api/store-responses", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ responses: data.responses }),
                                    });
                                    console.log("StoreRes", data.responses)
                                    if (!storeRes.ok) throw new Error("Erreur lors du stockage des réponses");

                                    const { id } = await storeRes.json();

                                    // Rediriger vers la page Rapport avec l'ID
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
                <button onClick={startListening} disabled={isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isListening ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}>
                    🎤 Démarrer
                </button>
                <button onClick={stopListening} disabled={!isListening}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!isListening ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}>
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
                </div>)}

            <div className="mt-4 flex gap-4">
                <button onClick={() => handleSearchResponse(text)} disabled={isQuestionSubmitted || !text || isSearching}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${isSearching ? "bg-yellow-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}>
                    🔍 Rechercher la réponse
                </button>

                {/*}
                <button onClick={handleTransferToSpeechToDatabase} disabled={!text}
                    className={`px-4 py-2 text-white font-semibold rounded-lg ${!response ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}>
                    ➡️ Transférer la question
                </button>

                */}
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


