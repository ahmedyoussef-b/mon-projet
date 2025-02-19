// src/components/SpeechComponent.tsx
import React from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"; // Chemin d'accès au fichier

const SpeechComponent = () => {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();

    return (
        <div>
            <h2>Reconnaissance vocale</h2>
            <p>{isListening ? "Écoute en cours..." : "En attente de votre question..."}</p>
            <p>Texte capturé : {text}</p>
            <button onClick={startListening} disabled={isListening}>Démarrer</button>
            <button onClick={stopListening} disabled={!isListening}>Arrêter</button>
        </div>
    );
};

export default SpeechComponent;
