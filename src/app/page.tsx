// /src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechToText } from "@/hooks/SpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import MicrophoneButton from "@/app/components/MicrophoneButton";
import MicrophoneStatus from "@/app/components/MicrophoneStatus";
import QuestionDisplay from "@/app/components/QuestionDisplay";
import ResponseDisplay from "@/app/components/ResponseDisplay";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { AnimatePresence, motion } from "framer-motion";

// Définir les types
type Reglage = {
  id?: number;
  reglage: number;
  instrument: string;
  action: string;
};

export default function HomePage() {
  const {
    text,
    textreponse,
    isListening,
    error: recognitionError,
    stopListening,
  } = useSpeechRecognition();

  const [showResponseTextarea, setShowResponseTextarea] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [reglages, setReglages] = useState<Reglage[] | Reglage | null>(null);
  const previousSpeechTextRef = useRef("");

  const { speakText, stopSpeaking, isSpeaking } = useTextToSpeech();

  const checkQuestion = async (questionText: string) => {
    const normalizedText = questionText.trim().toLowerCase();
    if (!normalizedText) return { message: "Aucune question détectée." };

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motCleText: normalizedText }),
      });
      console.log("motclé", normalizedText)
      if (!response.ok) throw new Error(`Erreur API: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la requête API :", error);
      return { message: "Une erreur s'est produite avec le serveur." };
    }
  };

  const handleSubmit = async (submittedText: string) => {
    const normalizedText = submittedText.trim().toLowerCase();
    if (!normalizedText || isSpeaking) return;

    try {
      const res = await checkQuestion(normalizedText);


      console.log("res1", res)

      if (res.type === "list") {

console.log("res.results",res.type)


        setReglages(res.results);
        setResponseText("Voici les niveaux disponibles :");
        speakText("Voici les niveaux disponibles.");
      } else if (res.type ==="single") {

console.log("res.response.type",res.type)

        setReglages(res.result);
        setResponseText(`Détails pour le niveau ${res.result.reglage} :`);
        speakText(`Détails pour le niveau ${res.result.reglage}   millimetre. est ${res.result.action}`);
      } else if (res.type === "range") {
        console.log("first", res.niveauInferieur)
        setReglages(res.results);
        setResponseText("Voici les niveaux proches :");
        speakText(`attention le prochain niveau est ${res.niveauInferieur.reglage} et sa serait ${res.niveauInferieur.action}` );
      }      
      else {
        setResponseText("Aucune information trouvée.");
        speakText("Aucune information trouvée.");
      }

      setShowResponseTextarea(true);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      setResponseText("Une erreur s'est produite.");
      speakText("Une erreur s'est produite.");
    }
  };

  const {
    text: speechToText,
    isListening: isSpeechListening,
    error: speechError,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening,
    handleTextChange,
  } = useSpeechToText(handleSubmit);

  const handleMicrophoneClick = () => {
    if (isListening || isSpeechListening) {
      stopListening();
      stopSpeechListening();
    } else {
      startSpeechListening();
    }
  };

  useEffect(() => {
    const normalizedSpeech = speechToText.trim().toLowerCase();
    if (normalizedSpeech.startsWith("répond") && normalizedSpeech !== previousSpeechTextRef.current) {
      previousSpeechTextRef.current = normalizedSpeech;
      handleSubmit(normalizedSpeech.replace("répond", "").trim());
    } else {
      setSpeechText(speechToText);
    }
  }, [speechToText]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full items-center m-5">
      <main className="grid grid-cols-1 gap-4 p-6 max-w-6xl mx-auto w-full bg-transparent">
        <MicrophoneButton isListening={isListening || isSpeechListening} onClick={handleMicrophoneClick} />
        <MicrophoneStatus isListening={isListening || isSpeechListening} />
        <ErrorDisplay error={recognitionError || speechError} />

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            aria-label="Arrêter la lecture"
          >
            Arrêter la lecture
          </button>
        )}

        {isSpeaking && <p className="text-green-500">Lecture en cours...</p>}

        <AnimatePresence>
          {text && <QuestionDisplay text={text} />}
          {textreponse && <ResponseDisplay textreponse={textreponse} />}
        </AnimatePresence>

        <div className="relative w-full">
          <textarea
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder={isSpeechListening ? "Parlez maintenant..." : "Saisissez votre texte ici..."}
            value={speechText}
            onChange={(e) => {
              handleTextChange(e);
              setSpeechText(e.target.value);
            }}
            disabled={isSpeechListening}
            aria-label="Zone de saisie de texte"
          />
          {speechText && (
            <button
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSpeechText("")}
              aria-label="Effacer le texte"
            >
              ✖
            </button>
          )}
        </div>

        <button
          type="button"
          className={`px-4 py-2 mt-4 rounded ${speechText.trim() ? "bg-green-500 text-black" : "bg-gray-400 text-black cursor-not-allowed"
            }`}
          onClick={() => handleSubmit(speechText)}
          disabled={!speechText.trim()}
          aria-label="Soumettre"
        >
          Soumettre
        </button>

        <AnimatePresence>
          {showResponseTextarea && (
            <motion.div
              className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 1.4 }}
            >
              <p className="text-lg font-semibold mb-4 text-gray-950">{responseText}</p>

              {Array.isArray(reglages) ? (
                <ul className="bg-teal-700 text-black">
                  {reglages.map((reglage) => (
                    <li key={reglage.id} className="btn border-b p-2">{`Niveau ${reglage.instrument} - ${reglage.reglage} : ${reglage.action}`}</li>
                  ))}
                </ul>
              ) : (
                reglages && (
                    <p className="text-black">{`Niveau ${reglages.instrument} -  : ${reglages.action}`}</p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
