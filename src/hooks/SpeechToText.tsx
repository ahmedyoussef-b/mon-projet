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
