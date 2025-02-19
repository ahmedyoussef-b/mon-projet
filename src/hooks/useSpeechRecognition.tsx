import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [forceStop, setForceStop] = useState(false);
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

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          setText(transcript);
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

  return { text, isListening, startListening, stopListening };
}
