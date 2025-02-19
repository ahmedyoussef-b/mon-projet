// src/components/SpeechComponent.tsx
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const SpeechComponent = () => {
    const { text, isListening, isVocalMode, enableVocalMode, disableVocalMode } = useSpeechRecognition();

    return (
        <div className="p-4 border rounded shadow-lg">
            <h1 className="text-xl font-bold mb-2">Reconnaissance Vocale</h1>

            <p className={`mb-2 font-semibold ${isVocalMode ? "text-green-600" : "text-red-600"}`}>
                {isVocalMode ? "🎤 Mode vocal activé" : "❌ Mode vocal désactivé"}
            </p>

            <p className="text-gray-700 italic mb-4">Texte capté : {text || "Aucun texte détecté"}</p>

            <div className="flex gap-4">
                {!isVocalMode && (
                    <button onClick={enableVocalMode} className="bg-green-500 text-white px-4 py-2 rounded">
                        Activer le mode vocal 🎙️
                    </button>
                )}

                {isVocalMode && (
                    <button onClick={disableVocalMode} className="bg-red-500 text-white px-4 py-2 rounded">
                        Désactiver le mode vocal ❌
                    </button>
                )}
            </div>

            {isListening && <p className="mt-4 text-blue-600">🎧 Écoute en cours...</p>}
        </div>
    );
};

export default SpeechComponent;
