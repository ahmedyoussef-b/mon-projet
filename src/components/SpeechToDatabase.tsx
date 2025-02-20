"use client";
import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useRouter } from "next/navigation"; // Importer le hook du routeur de Next.js

export default function SpeechToDatabase() {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();
    const [mode, setMode] = useState<"question" | "reponse">("question");
    const [response, setResponse] = useState<string | null>(null); // Contient la réponse de la base de données
    const [isQuestionSaved, setIsQuestionSaved] = useState(false); // Si la question a été sauvegardée
    const [manualText, setManualText] = useState<string>(""); // Saisie manuelle pour la réponse
    const router = useRouter(); // Utilisation du hook de navigation

    // Fonction pour démarrer la reconnaissance vocale selon le mode (question ou réponse)
    const handleStartListening = (newMode: "question" | "reponse") => {
        setMode(newMode);
        startListening(); // Démarrer la reconnaissance vocale
    };

    // Fonction pour arrêter l'enregistrement vocal
    const handleStopListening = () => {
        stopListening(); // Arrêter la reconnaissance vocale
    };

    // Fonction pour le traitement après le clic sur Submit
    const handleSubmit = async () => {
        if (mode === "question") {
            // Vérifier si la transcription contient le mot "question"
            if (text && text.toLowerCase().startsWith("question")) {
                // Chercher la réponse dans la base de données en utilisant le texte
                const response = await fetch(`/api/questions?query=${text}`);
                const data = await response.json();

                if (data.response) {
                    // Mettre à jour la réponse avec celle obtenue de l'API
                    setResponse(data.response);
                    // Si une réponse est trouvée, rediriger vers la page de rapport
                    router.push(`/rapport?question=${text}&response=${data.response}`);
                } else {
                    // Si aucune réponse n'est trouvée
                    alert("Aucune réponse trouvée. Vous pouvez enregistrer cette question.");
                    setIsQuestionSaved(true);
                    // Affichage du message vocal
                    const msg = new SpeechSynthesisUtterance("Aucune réponse trouvée. Vous pouvez enregistrer cette question.");
                    window.speechSynthesis.speak(msg);
                }
            } else {
                alert("Veuillez poser une question !");
            }
        } else if (mode === "reponse") {
            // Sauvegarder la réponse si le mode est "reponse"
            if (!manualText) {
                alert("Veuillez entrer une réponse manuellement avant de sauvegarder.");
                return;
            }
            // Appeler l'API pour sauvegarder la réponse
            await fetch(`/api/responses`, {
                method: "POST",
                body: JSON.stringify({ question: text, answer: manualText }), // Sauvegarder la question et la réponse
            });

            alert("Réponse sauvegardée avec succès !");
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">🎙️ Enregistrement vocal</h1>

            {/* Première colonne - Reconnaissance vocale */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                    <strong>Texte reconnu :</strong>
                </p>
                <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                    {text || <span className="text-gray-400">Parle et vois le texte ici...</span>}
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                {/* Boutons d'enregistrement vocal */}
                <button
                    onClick={() => handleStartListening("question")}
                    disabled={isListening}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    🎤 Démarrer Question
                </button>
                <button
                    onClick={() => handleStartListening("reponse")}
                    disabled={isListening || !isQuestionSaved}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    🎤 Démarrer Réponse
                </button>
                <button
                    onClick={handleStopListening}
                    disabled={!isListening}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    ⏹️ Arrêter
                </button>
            </div>

            {/* Deuxième colonne - Gestion de la question et réponse */}
            <div className="mt-6 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                {response ? (
                    <>
                        <p className="text-gray-700">
                            <strong>Réponse trouvée :</strong>
                        </p>
                        <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                            <p>{response}</p>
                        </div>
                        <button
                            onClick={() => setMode("reponse")}
                            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            ✅ Modifier la réponse
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-700">
                            <strong>Aucune réponse trouvée</strong>
                        </p>
                        <div className="mt-4">
                            <label className="block text-gray-700">Saisir une réponse manuellement :</label>
                            <textarea
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                                placeholder="Entrez votre réponse ici..."
                                rows={4}
                            />
                        </div>
                    </>
                )}

                {/* Bouton submit pour enregistrer ou soumettre */}
                <button
                    onClick={handleSubmit}
                    disabled={!text}
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                    💾 Soumettre / Sauvegarder
                </button>
            </div>
        </div>
    );
}

{/*}
import { useState } from "react";
import { useRouter } from "next/navigation"; // Assurez-vous d'importer useRouter de Next.js

export default function SpeechToDatabase() {
    const [isAnswerSaved, setIsAnswerSaved] = useState(false);
    const [manualText, setManualText] = useState<string>(""); // Réponse manuelle de l'utilisateur
    const [isClient, setIsClient] = useState(false); // Vérifie si le composant est monté côté client
    const router = useRouter(); // Utiliser le hook useRouter de Next.js

    // Fonction pour enregistrer la réponse dans la base de données
    const handleSaveResponse = async () => {
        if (!manualText) {
            alert("Veuillez entrer une réponse avant de sauvegarder.");
            return;
        }

        // Envoi de la réponse à l'API (vous pouvez ajouter des détails comme l'ID de la question si nécessaire)
        const response = await fetch(`/api/responses`, {
            method: "POST",
            body: JSON.stringify({
                question: manualText,  // Vous pouvez envoyer la question si vous avez un mécanisme pour récupérer l'ID de la question
                answer: manualText,
            }),
        });

        if (response.ok) {
            alert("Réponse enregistrée avec succès !");
            setIsAnswerSaved(true); // Indiquer que la réponse a été sauvegardée
            router.push("/rapport"); // Navigation vers la page de rapport après l'enregistrement
        } else {
            alert("Échec de l'enregistrement de la réponse.");
        }
    };

    // Assurez-vous que le composant est monté côté client
    useState(() => {
        setIsClient(true);
    }, []);

    // Ne pas afficher le composant si ce n'est pas côté client
    if (!isClient) return null;

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">💬 Saisie de la réponse</h1>

            {/* Affichage des champs de saisie de la réponse 
            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                    <strong>Entrez la réponse manuellement :</strong>
                </p>

                <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)} // Mettre à jour le texte de la réponse
                    className="w-full mt-2 p-3 border text-black border-gray-300 rounded-md"
                    placeholder="Tapez votre réponse ici..."
                    rows={4} // Nombre de lignes visibles
                />
            </div>

            {/* Bouton d'enregistrement de la réponse 
            <button
                onClick={handleSaveResponse}
                disabled={!manualText} // Désactive si aucun texte n'est saisi
                className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg ${isAnswerSaved ? "bg-green-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}
            >
                💾 Enregistrer Réponse
            </button>
        </div>
    );
}
*/}

