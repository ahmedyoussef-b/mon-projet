// Path: src/hooks/useSpeechRecognition.ts

/// <reference lib="dom" />

import { useState, useEffect, useRef, useCallback } from "react";

// Interface pour SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

// Interface pour SpeechRecognitionEvent
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

const useSpeechRecognition = () => {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isVocalMode, setIsVocalMode] = useState<boolean>(false); // Attend le mot "écoute"
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("API SpeechRecognition non supportée par ce navigateur.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition as {
      new (): SpeechRecognition;
    };
    recognitionRef.current = new SpeechRecognitionAPI();

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!recognitionRef.current) return;

      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      setText(transcript);

      // Déclenchement selon le mot détecté
      if (isVocalMode) {
        if (!isListening && transcript.includes("écoute")) {
          startListening();
        } else if (isListening && transcript.includes("répond")) {
          stopListening();
        }
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    return () => {
      recognition.stop();
    };
  }, [isVocalMode, isListening, startListening, stopListening]); // Ajout des dépendances nécessaires

  // Active le mode vocal (attente du mot "écoute")
  const enableVocalMode = useCallback(() => {
    setIsVocalMode(true);
    setText("Mode vocal activé. Dites 'écoute' pour commencer.");
  }, []);

  // Désactive complètement le mode vocal
  const disableVocalMode = useCallback(() => {
    setIsVocalMode(false);
    stopListening();
    setText("Mode vocal désactivé.");
  }, [stopListening]);

  return { text, isListening, enableVocalMode, disableVocalMode };
};

export default useSpeechRecognition;
