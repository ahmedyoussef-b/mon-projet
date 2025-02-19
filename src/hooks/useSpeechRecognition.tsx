import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "fr-FR";

        recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          setText(transcript);

          // Vérifier si la phrase commence par "question"
          if (transcript.toLowerCase().startsWith("question")) {
            const questionText = transcript.replace(/^question\s*/i, ""); // Supprimer "question"
            await handleQuestion(questionText);
          }
        };

        recognitionRef.current.onend = () => {
          if (!forceStop) {
            console.log("Micro relancé automatiquement...");
            recognitionRef.current?.start();
          } else {
            setIsListening(false);
          }
        };
      } else {
        console.error("API SpeechRecognition non supportée par ce navigateur.");
      }
    }
  }, [forceStop]);

  const handleQuestion = async (questionText: string) => {
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      const data = await response.json();
      if (data.id) {
        setLastQuestionId(data.id);
      }

      if (data.reponse) {
        speakText(data.reponse);
      } else {
        speakText("Pas de réponse");
      }
    } catch (error) {
      console.error("Erreur lors de la gestion de la question :", error);
    }
  };

  const saveResponse = async () => {
    if (!lastQuestionId || !text) return;
    try {
      await fetch("/api/reponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: lastQuestionId, reponse: text }),
      });
      setText(""); // Réinitialise le texte après enregistrement
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réponse :", error);
    }
  };

  const speakText = (message: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setForceStop(false);
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setForceStop(true);
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { text, isListening, startListening, stopListening, saveResponse };
}
