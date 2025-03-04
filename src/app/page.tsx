// /src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechToText } from "@/hooks/SpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech"; // Importer le hook de synthèse vocale
import MicrophoneButton from "@/app/components/MicrophoneButton";
import MicrophoneStatus from "@/app/components/MicrophoneStatus";
import QuestionDisplay from "@/app/components/QuestionDisplay";
import ResponseDisplay from "@/app/components/ResponseDisplay";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  const {
    text, // Texte de la question reconnue
    textreponse, // Texte de la réponse reconnue
    isListening, // État du microphone (activé/désactivé)
    error: recognitionError, // Erreur de reconnaissance vocale
    stopListening, // Fonction pour arrêter l'écoute
  } = useSpeechRecognition();

  const [showResponseTextarea, setShowResponseTextarea] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [speechText, setSpeechText] = useState(""); // Texte de la reconnaissance vocale
  const previousSpeechTextRef = useRef(""); // Référence pour mémoriser le texte précédent

  // Utiliser le hook de synthèse vocale
  const { speakText, stopSpeaking, isSpeaking } = useTextToSpeech();

  const checkQuestion = async (questionText: string) => {
    // Normalisation du texte : on enlève les espaces et convertit en minuscule
    const normalizedText = questionText.trim().toLowerCase();
    console.log("Texte envoyé à la base de données pour vérification :", normalizedText); // Débogage

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText: normalizedText }),
      });
      console.log(response);

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erreur lors de la requête API :", error);
      return { message: "Une erreur s'est produite." };
    }
  };

  const handleSubmit = async (submittedText: string) => {
    // Vérifier si le texte est vide après retrait de "répond"
    if (!submittedText.trim()) {
      console.log("Texte vide après retrait de 'répond'.");
      return; // On évite l'alerte ici, juste un log pour vérifier.
    }

    // Empêcher les appels multiples
    if (isSpeaking) {
      console.log("La synthèse vocale est déjà en cours.");
      return;
    }

    try {
      const normalizedText = submittedText.trim().toLowerCase();
      const result = await checkQuestion(normalizedText);

      if (result.reponse) {
        setResponseText(result.reponse);
        speakText(result.reponse); // Lire la réponse avec la synthèse vocale
      } else {
        setResponseText(result.message);
        speakText(result.message); // Lire le message d'erreur
      }

      setShowResponseTextarea(true);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite lors de la soumission.");
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

  // Fonction qui va activer la soumission si "répond" est reconnu
  const handleSpeechRecognition = () => {
    const normalizedSpeech = speechToText.toLowerCase();

    // Si "répond" est présent, on retire "répond" de la question
    if (normalizedSpeech.includes("répond") && normalizedSpeech !== previousSpeechTextRef.current) {
      const questionWithoutRepond = normalizedSpeech.replace("répond", "").trim();
      handleSubmit(questionWithoutRepond); // Soumettre sans "répond"
      previousSpeechTextRef.current = normalizedSpeech; // Mémoriser le texte
    } else {
      setSpeechText(speechToText); // Sinon, juste mettre à jour le texte
    }
  };

  useEffect(() => {
    if (speechToText) {
      handleSpeechRecognition(); // Vérifier si "répond" est prononcé
    }
  }, [speechToText]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full items-center m-5">
      <main className="grid grid-cols-1 gap-4 p-6 max-w-6xl mx-auto w-full bg-transparent">
        <MicrophoneButton isListening={isListening || isSpeechListening} onClick={handleMicrophoneClick} />
        <MicrophoneStatus isListening={isListening || isSpeechListening} />
        <ErrorDisplay error={recognitionError || speechError} />

        {/* Bouton pour arrêter la lecture de la synthèse vocale */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Arrêter la lecture
          </button>
        )}

        {/* Indicateur visuel pour la lecture en cours */}
        {isSpeaking && <p className="text-green-500">Lecture en cours...</p>}

        <AnimatePresence>{text && <QuestionDisplay text={text} />}</AnimatePresence>
        <AnimatePresence>{textreponse && <ResponseDisplay textreponse={textreponse} />}</AnimatePresence>

        <textarea
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder={isSpeechListening ? "Parlez maintenant... (mode vocal activé)" : "Saisissez votre texte ici..."}
          value={speechText}
          onChange={handleTextChange}
          disabled={isSpeechListening}
        />

        <button
          type="button"
          className={`px-4 py-2 mt-4 rounded ${speechText.trim() ? "bg-green-500 text-black" : "bg-gray-400 text-black cursor-not-allowed"}`}
          onClick={() => handleSubmit(speechText)}
          disabled={!speechText.trim()}
        >
          Soumettre
        </button>

        <AnimatePresence>
          {showResponseTextarea && (
            <motion.textarea
              className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              rows={6}
              placeholder="La réponse apparaîtra ici..."
              value={responseText}
              readOnly
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


{/*}
import { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechToText } from "@/hooks/SpeechToText";
import MicrophoneButton from "@/app/components/MicrophoneButton";
import MicrophoneStatus from "@/app/components/MicrophoneStatus";
import QuestionDisplay from "@/app/components/QuestionDisplay";
import ResponseDisplay from "@/app/components/ResponseDisplay";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  const {
    text, // Texte de la question reconnue
    textreponse, // Texte de la réponse reconnue
    isListening, // État du microphone (activé/désactivé)
    error: recognitionError, // Erreur de reconnaissance vocale
    stopListening, // Fonction pour arrêter l'écoute
  } = useSpeechRecognition();

  const [showResponseTextarea, setShowResponseTextarea] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [speechText, setSpeechText] = useState(""); // Texte de la reconnaissance vocale
  const previousSpeechTextRef = useRef(""); // Référence pour mémoriser le texte précédent

  const checkQuestion = async (questionText: string) => {
    // Normalisation du texte : on enlève les espaces et convertit en minuscule
    const normalizedText = questionText.trim().toLowerCase();
    console.log("Texte envoyé à la base de données pour vérification :", normalizedText); // Débogage

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText: normalizedText }),
      });
console.log(response)

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erreur lors de la requête API :", error);
      return { message: "Une erreur s'est produite." };
    }
  };

  const handleSubmit = async (submittedText: string) => {
    // Vérifier si le texte est vide après retrait de "répond"
    if (!submittedText.trim()) {
      console.log("Texte vide après retrait de 'répond'.");
      return; // On évite l'alerte ici, juste un log pour vérifier.
    }

    try {
      const normalizedText = submittedText.trim().toLowerCase();
      const result = await checkQuestion(normalizedText);

      if (result.reponse) {
        setResponseText(result.reponse);
      } else {
        setResponseText(result.message);
      }

      setShowResponseTextarea(true);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite lors de la soumission.");
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

  // Fonction qui va activer la soumission si "répond" est reconnu
  const handleSpeechRecognition = () => {
    const normalizedSpeech = speechToText.toLowerCase();

    // Si "répond" est présent, on retire "répond" de la question
    if (normalizedSpeech.includes("répond") && normalizedSpeech !== previousSpeechTextRef.current) {
      const questionWithoutRepond = normalizedSpeech.replace("répond", "").trim();
      handleSubmit(questionWithoutRepond); // Soumettre sans "répond"
      previousSpeechTextRef.current = normalizedSpeech; // Mémoriser le texte
    } else {
      setSpeechText(speechToText); // Sinon, juste mettre à jour le texte
    }
  };

  useEffect(() => {
    if (speechToText) {
      handleSpeechRecognition(); // Vérifier si "répond" est prononcé
    }
  }, [speechToText]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full items-center m-5">
      <main className="grid grid-cols-1 gap-4 p-6 max-w-6xl mx-auto w-full bg-transparent">
        <MicrophoneButton isListening={isListening || isSpeechListening} onClick={handleMicrophoneClick} />
        <MicrophoneStatus isListening={isListening || isSpeechListening} />
        <ErrorDisplay error={recognitionError || speechError} />

        <AnimatePresence>{text && <QuestionDisplay text={text} />}</AnimatePresence>
        <AnimatePresence>{textreponse && <ResponseDisplay textreponse={textreponse} />}</AnimatePresence>

        <textarea
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder={isSpeechListening ? "Parlez maintenant... (mode vocal activé)" : "Saisissez votre texte ici..."}
          value={speechText}
          onChange={handleTextChange}
          disabled={isSpeechListening}
        />

        <button
          type="button" // Ajout de type="button" pour éviter les soumissions involontaires
          className={`px-4 py-2 mt-4 rounded ${speechText.trim() ? "bg-green-500 text-black" : "bg-gray-400 text-black cursor-not-allowed"}`}
          onClick={() => handleSubmit(speechText)}
          disabled={!speechText.trim()}
        >
          Soumettre
        </button>

        <AnimatePresence>
          {showResponseTextarea && (
            <motion.textarea
              className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              rows={6}
              placeholder="La réponse apparaîtra ici..."
              value={responseText}
              readOnly
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
  */}