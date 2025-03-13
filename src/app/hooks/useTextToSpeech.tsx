// src/hooks/useTextToSpeech.ts
"use client"
import { useState, useCallback } from "react";

export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false); // État pour vérifier si la synthèse vocale est en cours

    const speakText = useCallback((text: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            console.error("La synthèse vocale n'est pas supportée par votre navigateur.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR"; // Définir la langue (français)
        utterance.rate = 1; // Vitesse de lecture (1 = normale)
        utterance.pitch = 1; // Hauteur de la voix (1 = normale)

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error("Erreur lors de la synthèse vocale :", event);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);  // Utilisation de useCallback pour ne pas redéfinir speakText à chaque rendu

    const stopSpeaking = useCallback(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speakText, stopSpeaking, isSpeaking };
}

{/*}
import { useState, useCallback } from "react";

export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false); // État pour vérifier si la synthèse vocale est en cours

    const speakText = useCallback((text: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            console.error("La synthèse vocale n'est pas supportée par votre navigateur.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR"; // Définir la langue (français)
        utterance.rate = 1; // Vitesse de lecture (1 = normale)
        utterance.pitch = 1; // Hauteur de la voix (1 = normale)

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error("Erreur lors de la synthèse vocale :", event);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const stopSpeaking = useCallback(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speakText, stopSpeaking, isSpeaking };
}
*/}