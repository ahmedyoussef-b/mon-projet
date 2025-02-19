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
  const [isListening, setIsListening] = useState<boolean>(false); // État de l'écoute
  const [isVocalMode, setIsVocalMode] = useState<boolean>(false); // État du mode vocal
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
    recognition.onend = () => {
      if (isVocalMode) {
        // Si le mode vocal est activé, on redémarre la reconnaissance
        recognition.start();
      } else {
        setIsListening(false); // L'écoute s'arrête uniquement si le mode vocal est désactivé
      }
    };

    return () => {
      recognition.stop();
    };
  }, [isVocalMode]);

  const enableVocalMode = useCallback(() => {
    setIsVocalMode(true);
    setText("Mode vocal activé. Dites 'écoute' pour commencer.");
    recognitionRef.current?.start(); // Démarre la reconnaissance vocale
  }, []);

  const disableVocalMode = useCallback(() => {
    setIsVocalMode(false);
    recognitionRef.current?.stop(); // Arrête la reconnaissance vocale
    setText("Mode vocal désactivé.");
  }, []);

  const HandleSpeechCommands = useCallback(
    async (command: string) => {
      if (command.includes("manœuvre")) {
        router.push("/manoeuvres"); // Redirige vers la page des manœuvres
      } else if (command.includes("alarme")) {
        router.push("/alarmes"); // Redirige vers la page des alarmes
      } else if (command.includes("rapport")) {
        router.push("/rapports"); // Redirige vers la page des rapports
      } else if (command.includes("home")) {
        router.push("/"); // Redirige vers la page d'accueil
      } else if (command.includes("répond")) {
        // Insérer une réponse dans la base de données avec Prisma
        await prisma.response.create({
          data: {
            text: "Voici la réponse à votre demande.",
          },
        });

        // Affichage de la réponse sur l'écran
        setText("Voici la réponse à votre demande.");

        // Réponse vocale (facultatif)
        const speech = new SpeechSynthesisUtterance("Voici la réponse à votre demande.");
        window.speechSynthesis.speak(speech);
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
