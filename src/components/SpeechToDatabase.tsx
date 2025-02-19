"use client";

import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function SpeechToDatabase() {
    const { text, isListening, startListening, stopListening, mode } =
        useSpeechRecognition();
    const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);

    const saveToDatabase = async () => {
        if (mode === "question") {
            setCurrentQuestion(text);
            await fetch("/api/question", {
                method: "POST",
                body: JSON.stringify({ question: text }),
            });
        } else if (mode === "reponse" && currentQuestion) {
            await fetch("/api/reponse", {
                method: "POST",
                body: JSON.stringify({ question: currentQuestion, reponse: text }),
            });
            setCurrentQuestion(null);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">🎙️ Enregistrement vocal</h1>

            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                    <strong>Texte reconnu :</strong>
                </p>
                <div className="p-3 mt-2 border border-gray-300 rounded-md min-h-[80px]">
                    {text || <span className="text-gray-400">Parle pour voir le texte...</span>}
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={() => startListening("question")}
                    disabled={isListening}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    ❓ Enregistrer Question
                </button>
                <button
                    onClick={() => startListening("reponse")}
                    disabled={isListening || !currentQuestion}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    ✅ Enregistrer Réponse
                </button>
                <button
                    onClick={stopListening}
                    disabled={!isListening}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    ⏹️ Arrêter
                </button>
            </div>

            <button
                onClick={saveToDatabase}
                disabled={!text}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                💾 Sauvegarder
            </button>
        </div>
    );
}
