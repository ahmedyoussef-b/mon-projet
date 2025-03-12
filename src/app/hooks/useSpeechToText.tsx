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
    const previousTextRef = useRef(""); // Référence pour mémoriser le texte précédent

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

            // Vérifier si le mot "répond" est dans la transcription et éviter les appels multiples
            if (transcript.toLowerCase().includes("répond") && transcript !== previousTextRef.current) {
                const questionWithoutRepond = transcript.replace("répond", "").trim();
                onSubmit(questionWithoutRepond); // Soumettre sans "répond"
                previousTextRef.current = transcript; // Mémoriser le texte
            }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Erreur de reconnaissance vocale :", event.error);
            setError("Erreur lors de la reconnaissance vocale : " + event.error);
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

    // Nettoyage lors du démontage du composant
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

*/}