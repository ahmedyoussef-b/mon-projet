// src/hooks/useSpeechRecognition.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import prisma from "@/lib/prisma";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onstart: () => void;
  onend: () => void;
}

export const useSpeechRecognition = () => {
  const router = useRouter();
  const [text, setText] = useState<string>(""); // Texte reconnu
  const [isListening, setIsListening] = useState<boolean>(false); // État du micro
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

    recognition.continuous = true; // Mode écoute continue
    recognition.interimResults = false; // Pas de résultats intermédiaires
    recognition.lang = "fr-FR"; // Langue de reconnaissance (Français)

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      setText(transcript); // Affiche le texte prononcé
      console.log("Texte capté :", transcript);
      await HandleSpeechCommands(transcript); // Traite les commandes vocales
    };

    recognition.onstart = () => setIsListening(true); // L'écoute démarre
    recognition.onend = () => setIsListening(false); // L'écoute s'arrête uniquement si l'utilisateur arrête manuellement

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    recognitionRef.current?.start(); // Active l'écoute
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop(); // Désactive l'écoute
    setIsListening(false);
  }, []);

  const HandleSpeechCommands = useCallback(
    async (command: string) => {
      if (command.includes("manœuvre")) {
        router.push("/manoeuvres");
      } else if (command.includes("alarme")) {
        router.push("/alarmes");
      } else if (command.includes("rapport")) {
        router.push("/rapports");
      } else if (command.includes("home")) {
        router.push("/");
      } else if (command.includes("répond")) {
        await prisma.response.create({
          data: {
            text: "Voici la réponse à votre demande.",
          },
        });

        setText("Voici la réponse à votre demande.");

        const speech = new SpeechSynthesisUtterance("Voici la réponse à votre demande.");
        window.speechSynthesis.speak(speech);
      }
    },
    [router]
  );

  return {
    text,
    isListening,
    startListening,
    stopListening,
  };
};
