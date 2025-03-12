
// /src/hooks/useSpeechRecognition.tsx
import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  // États
  const [textreponse, setTextReponse] = useState("");
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Référence pour l'API de reconnaissance vocale
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Fonction pour gérer les questions
  const handleQuestion = useCallback(async (questionText: string): Promise<boolean> => {
    if (!questionText) return false;

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const data = await response.json();
      if (data.id) setLastQuestionId(data.id);

      // Lire la réponse à voix haute
      speakText(data.reponse || "Pas de réponse");
      return true;
    } catch (error) {
      console.error("Erreur lors de la gestion de la question :", error);
      setError("Erreur lors de la gestion de la question");
      return false;
    }
  }, []);

  // Fonction pour lire un texte à voix haute
  const speakText = useCallback((message: string) => {
    if (!message) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  }, []);

  // Fonction pour démarrer l'écoute
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setForceStop(false);
      recognitionRef.current.start();
      setIsListening(true);
      setError(null); // Réinitialiser les erreurs
    }
  }, [isListening]);

  // Fonction pour arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setForceStop(true);
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Fonction pour sauvegarder une réponse
  const saveResponse = useCallback(async (): Promise<boolean> => {
    if (!lastQuestionId || !textreponse.trim()) return false;

    try {
      const response = await fetch("/api/reponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: lastQuestionId, reponse: textreponse }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la réponse");
      }

      setText("");
      setTextReponse("");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réponse :", error);
      setError("Erreur lors de l'enregistrement de la réponse");
      return false;
    }
  }, [lastQuestionId, textreponse]);

  // Fonction pour gérer les changements de texte (question)
  const handleTextInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }, []);

  // Fonction pour gérer les changements de texte (réponse)
  const handleTextResponseInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextReponse(event.target.value);
  }, []);

  // Effet pour initialiser l'API de reconnaissance vocale
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error("API SpeechRecognition non supportée par ce navigateur.");
      setError("API SpeechRecognition non supportée par ce navigateur.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "fr-FR";

    // Gestion des résultats de la reconnaissance vocale
    recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      if (transcript.toLowerCase().startsWith("question")) {
        const questionText = transcript.replace(/^question\s/i, "");
        setText(questionText);
        await handleQuestion(questionText);
      } else if (transcript.toLowerCase().startsWith("répond")) {
        const responseText = transcript.replace(/^répond\s/i, "");
        setTextReponse(responseText);
        await handleQuestion(responseText);
      }
    };

    // Gestion de la fin de l'écoute
    recognitionRef.current.onend = () => {
      if (!forceStop && recognitionRef.current) {
        console.log("Micro relancé automatiquement...");
        recognitionRef.current.start();
      } else {
        setIsListening(false);
      }
    };

    // Nettoyage à la destruction du composant
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [handleQuestion, forceStop]);

  // Retourner les états et fonctions
  return {
    text,
    textreponse,
    isListening,
    error,
    startListening,
    stopListening,
    saveResponse,
    handleTextInputChange,
    handleTextResponseInputChange,
  };
}
{/*}

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  // États
  const [textreponse, setTextReponse] = useState("");
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Ajout d'un état pour les erreurs

  // Référence pour l'API de reconnaissance vocale
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Fonction pour gérer les questions
  const handleQuestion = useCallback(async (questionText: string): Promise<boolean> => {
    if (!questionText) return false;

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const data = await response.json();
      if (data.id) setLastQuestionId(data.id);

      // Lire la réponse à voix haute
      speakText(data.reponse || "Pas de réponse");
      return true;
    } catch (error) {
      console.error("Erreur lors de la gestion de la question :", error);
      setError("Erreur lors de la gestion de la question");
      return false;
    }
  }, []);

  // Fonction pour lire un texte à voix haute
  const speakText = useCallback((message: string) => {
    if (!message) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  }, []);

  // Fonction pour démarrer l'écoute
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setForceStop(false);
      recognitionRef.current.start();
      setIsListening(true);
      setError(null); // Réinitialiser les erreurs
    }
  }, [isListening]);

  // Fonction pour arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setForceStop(true);
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Fonction pour sauvegarder une réponse
  const saveResponse = useCallback(async (): Promise<boolean> => {
    if (!lastQuestionId || !textreponse.trim()) return false;

    try {
      const response = await fetch("/api/reponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: lastQuestionId, reponse: textreponse }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la réponse");
      }

      setText("");
      setTextReponse("");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réponse :", error);
      setError("Erreur lors de l'enregistrement de la réponse");
      return false;
    }
  }, [lastQuestionId, textreponse]);

  // Fonction pour gérer les changements de texte (question)
  const handleTextInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }, []);

  // Fonction pour gérer les changements de texte (réponse)
  const handleTextResponseInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextReponse(event.target.value);
  }, []);

  // Effet pour initialiser l'API de reconnaissance vocale
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error("API SpeechRecognition non supportée par ce navigateur.");
      setError("API SpeechRecognition non supportée par ce navigateur.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "fr-FR";

    // Gestion des résultats de la reconnaissance vocale
    recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      if (transcript.toLowerCase().startsWith("question")) {
        setText(transcript);
 //       const questionText = transcript.replace(/^question\s/i, "");
  //      await handleQuestion(questionText);
   //   }

   //   if (transcript.toLowerCase().startsWith("répond")) {
     //   setTextReponse(transcript);
        const responseText = transcript.replace(/^répond\s/i, "");
        await handleQuestion(responseText);
      }
    };

    // Gestion de la fin de l'écoute
    recognitionRef.current.onend = () => {
      if (!forceStop && recognitionRef.current) {
        console.log("Micro relancé automatiquement...");
        recognitionRef.current.start();
      } else {
        setIsListening(false);
      }
    };

    // Nettoyage à la destruction du composant
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [handleQuestion, forceStop]);

  // Retourner les états et fonctions
  return {
    text,
    textreponse,
    isListening,
    error, // Retourner l'état d'erreur
    startListening,
    stopListening,
    saveResponse,
    handleTextInputChange,
    handleTextResponseInputChange,
  };
}
*/}