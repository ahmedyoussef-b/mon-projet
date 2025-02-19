
///src/hkoos / useSpeechRecognition.ts;
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

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

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export const useSpeechRecognition = () => {
  const router = useRouter();
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
      new(): SpeechRecognition;
    };
    recognitionRef.current = new SpeechRecognitionAPI();

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      setText(transcript);
      HandleSpeechCommands(transcript);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    return () => {
      recognition.stop();
    };
  }, []);

  const enableVocalMode = useCallback(() => {
    setIsVocalMode(true);
    setText("Mode vocal activé. Dites 'écoute' pour commencer.");
    recognitionRef.current?.start();
  }, []);

  const disableVocalMode = useCallback(() => {
    setIsVocalMode(false);
    recognitionRef.current?.stop();
    setText("Mode vocal désactivé.");
  }, []);

  const HandleSpeechCommands = useCallback(
    (command: string) => {
      if (command.includes("manœuvre")) {
        router.push("/manoeuvres");
      } else if (command.includes("alarme")) {
        router.push("/alarmes");
      } else if (command.includes("rapport")) {
        router.push("/rapports");
      } else if (command.includes("home")) {
        router.push("/");
      }
    },
    [router]
  );

  return {
    text,
    isListening,
    isVocalMode,
    enableVocalMode,
    disableVocalMode,
  };
};
