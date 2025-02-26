
// /src/hooks/useSpeechRecognition.tsx
import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  const [textreponse ,setTextReponse]=useState("")
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleQuestion = useCallback(async (questionText: string): Promise<boolean> => {
    if (!questionText) return false;
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });
      const data = await response.json();
      if (data.id) setLastQuestionId(data.id);
      speakText(data.reponse || "Pas de réponse");
      return true;

    } catch (error) {
      console.error("Erreur lors de la gestion de la question :", error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error("API SpeechRecognition non supportée par ce navigateur.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "fr-FR";

    recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setText(transcript);
      setTextReponse(transcript)
      if (transcript.toLowerCase().startsWith("question")) {
        const questionText = transcript.replace(/^question\s*/i, "");
        await handleQuestion(questionText);
      }
      if (transcript.toLowerCase().startsWith("response")){
        const responseText = transcript.replace(/^response\s*/i, "")
        await handleQuestion(responseText)
      }
    };

    recognitionRef.current.onend = () => {
      if (!forceStop && recognitionRef.current) {
        console.log("Micro relancé automatiquement...");
        recognitionRef.current.start();
      } else {
        setIsListening(false);
      }
    };

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [handleQuestion, forceStop]);

  const handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  const handleTextResponseInputChange=(event:React.ChangeEvent<HTMLTextAreaElement>)=>{
    setTextReponse(event.target.value)
  }

  const saveResponse = async (): Promise<boolean> => {
    if (!lastQuestionId || !textreponse.trim()) return false;
    try {
      await fetch("/api/reponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: lastQuestionId, reponse: textreponse }),
      });
      setText("");
      setTextReponse("");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réponse :", error);
      return false;
    }
  };

  const speakText = (message: string) => {
    if (!message) return;
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

  return { text, textreponse, isListening, startListening, stopListening, saveResponse, handleTextInputChange, handleTextResponseInputChange };
}
