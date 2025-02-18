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
  const [isVocalMode, setIsVocalMode] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

      // Activation de l'écoute après le mot "écoute"
      if (isVocalMode && transcript.includes("écoute") && !isListening) {
        recognition.start();
        setIsListening(true);
      }

      // Désactivation après le mot "répond"
      if (isListening && transcript.includes("répond")) {
        recognition.stop();
        setIsListening(false);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    return () => {
      recognition.stop();
    };
  }, [isVocalMode, isListening]); // Suppression des callbacks pour éviter les erreurs eslint

  // Active le mode vocal, mais attend "écoute" pour démarrer l'écoute réelle
  const enableVocalMode = useCallback(() => {
    setIsVocalMode(true);
    setText("Mode vocal activé. Dites 'écoute' pour commencer.");
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  // Désactive complètement le mode vocal
  const disableVocalMode = useCallback(() => {
    setIsVocalMode(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setText("Mode vocal désactivé.");
  }, []);

  return { text, isListening, enableVocalMode, disableVocalMode };
};

export default useSpeechRecognition;
