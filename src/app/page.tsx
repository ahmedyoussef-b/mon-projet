// /src/app/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/app/hooks/useTextToSpeech";
import { useSpeechToText } from "@/app/hooks/useSpeechToText";
import MicrophoneButton from "@/app/components/HomePage/MicrophoneButton";
import MicrophoneStatus from "@/app/components/HomePage/MicrophoneStatus";
import QuestionDisplay from "@/app/components/HomePage/QuestionDisplay";
import ResponseDisplay from "@/app/components/HomePage/ResponseDisplay";
import ErrorDisplay from "@/app/components/HomePage/ErrorDisplay";
import ReglageDetail from "@/app/components/HomePage/ReglageDetail";
import ConditionsList from "@/app/components/HomePage/ConditionsList";
import SpeechTextArea from "@/app/components/HomePage/SpeechTextArea";
import { AnimatePresence, motion } from "framer-motion";
import {

  ReglagesListType,
  RegroupementsListType,
  AlarmesListType,
  ConditionsListType,
  ReglageDetailType,
  Reglage,
  Regroupement,
  Alarme

} from "@/app/types/types";
import SubmitButton from "./components/HomePage/SubmitButton";
import AlarmModal from "./components/HomePage/AlarmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegroupementsList from "./components/HomePage/RegroupementsList";
import NiveauxList from "./components/HomePage/NiveauxList";
import { Niveau } from "@prisma/client";

type ResultData =
  | ReglagesListType
  | RegroupementsListType
  | AlarmesListType
  | ReglageDetailType
  | ConditionsListType
  | Alarme // Ajouter le type Alarme
  | null;


const HomePage = () => {


  const [showResponseTextarea, setShowResponseTextarea] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [results, setResults] = useState<{ type: string; data: ResultData } | null>(null);
  const [speechText, setSpeechText] = useState("");
  const { text, isListening, error: recognitionError, stopListening } = useSpeechRecognition();
  const { speakText, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [selectedAlarme, setSelectedAlarme] = useState<string | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmModalData, setAlarmModalData] = useState<{
    message: string;
    actions: string[];
    suggestion?: { mot: string };
  } | null>(null);
  
  // Type guard pour vérifier si un objet est de type Reglage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isReglage(data: any): data is Reglage {
    return (
      typeof data === "object" &&
      data !== null &&
      "reglage" in data &&
      "organe" in data &&
      "action" in data &&
      "instrument" in data // Supprime la vérification de 'description' si elle est manquante
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isAlarme(data: any): data is Alarme {
    return (
      typeof data === "object" &&
      data !== null &&
      "nom" in data &&
      "description" in data &&
      "consequence" in data &&
      "instructions" in data &&
      "Parametre" in data
    );
  }
  
  const handleSubmit = useCallback(
    async (submittedText: string) => {
      const normalizedText = submittedText.trim().toLowerCase();
      console.log("normalizedText", normalizedText)

      if (!normalizedText || isSpeaking) return;

      try {
        const res = await fetch("/api/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motCleText: normalizedText }),
        });
        console.log("res", res)
        if (!res.ok) {
          console.error("Erreur API :", await res.text());
          throw new Error("Erreur API lors de la récupération des données.");
        }

        const data = await res.json();
        console.log("data", data)
       
        // Formater les résultats pour s'assurer que `results.data` est un tableau
        let formattedData: ResultData;

        switch (data.type) {
          case "exact":
            formattedData = data.result; // Pour "exact", utiliser `data.result`
            break;
          case "range":
            formattedData = {
              niveauInferieur: data.niveauInferieur,
              niveauSuperieur: data.niveauSuperieur,
            };
            break;
          case "all":
          case "regroupements":
          case "alarmes":
          case "ConditionDemarrage":
          case "ConditionDeclenchement":
          case "ConditionOuverture":
          case "ConditionFermeture":
            // Formater les résultats pour s'assurer que `results.data` est un tableau
            formattedData = Array.isArray(data.results) ? data.results : [data.results];
            break;
          default:
            formattedData = null; // Par défaut, `null`
        }

       
        setResults({
          type: data.type,
          data: formattedData, // Assurez-vous que c'est un tableau
        });


        if (data.type === "nouvelle_alarme") {
          // Afficher la boîte de dialogue pour les actions utilisateur
          setAlarmModalData({
            message: data.message,
            actions: data.actions,
            suggestion: data.suggestion,
          });
          setShowAlarmModal(true);
          setSelectedAlarme(data.suggestion?.mot || null);
          return;
        }

        if (data.type === "alarme") {
          setResults({
            type: "alarme",
            data: data.result, // Stocker les détails de l'alarme dans `results`
          });
          setResponseText(`Détails de l'alarme "${data.result.nom}".`);
          speakText(`Détails de l'alarme "${data.result.nom}".`);
        }

        // Gérer la réponse vocale
        if (data.type === "exact") {
          setResponseText(
            `Détails pour le niveau ${data.result?.reglage ?? "Inconnu"} mm : ${data.result?.description ?? "Aucune information disponible"
            }`
          );
          console.log("Data reçue :", data);

          speakText(`Détails pour le niveau ${data.result.reglage}.`);
        } else if (data.type === "range") {
          setResponseText("Voici les niveaux proches :");
          speakText(`Attention, le niveau inférieur est ${data.niveauInferieur.reglage}.`);
        } else if (data.type === "all") {
          setResponseText("Voici les niveaux disponibles :");
          speakText("Voici les niveaux disponibles.");
        } else if (data.type === "regroupements") {
          setResponseText("Voici les regroupements de niveaux :");
          speakText("Voici les regroupements de niveaux.");
        } else if (data.type === "alarmes") {
          setResponseText("Voici les alarmes correspondantes :");
          speakText("Voici les alarmes correspondantes.");
        } else if (data.type === "ConditionDemarrage" || data.type === "ConditionDeclenchement" || data.type === "ConditionOuverture" || data.type === "ConditionFermeture") {
          setResponseText(`Voici les conditions de ${data.type} :`);
          speakText(`Voici les conditions de ${data.type}.`);
        } else {
          setResponseText("Aucune information trouvée.");
          speakText("Aucune information trouvée.");
        }

        setShowResponseTextarea(true);
      } catch (error) {
        console.error("Erreur lors de la soumission :", error);
        setResponseText("Une erreur s'est produite.");
        speakText("Une erreur s'est produite.");
      }
    },
    [isSpeaking, speakText]
  );
//alarme

  const handleAlarmAction = async (action: string, newMotCle?: string) => {
    if (!selectedAlarme) return;
    console.log("selectedAlarme", selectedAlarme)
    try {
      let response;
      switch (action) {
        case "corriger":
          if (!newMotCle) return;
          response = await fetch("/api/alarme/corriger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ancienMotCle: selectedAlarme, nouveauMotCle: newMotCle }),
          });
          console.log("response corriger", response)
          break;
        case "ajouter":
          response = await fetch("/api/alarme/ajouter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nom: selectedAlarme,
              description: "Description à définir", // À remplacer par une saisie utilisateur
              instructions: [], // À remplacer par une saisie utilisateur
              consequence: "Conséquence à définir", // À remplacer par une saisie utilisateur
              circuitId: 1, // À remplacer par une saisie utilisateur
              parametres: [], // À remplacer par une saisie utilisateur
            }),
          });
          console.log("response ajouter", response)

          break;
        case "supprimer":
          response = await fetch("/api/alarme/supprimer", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: selectedAlarme }),
          });
          console.log("response supprimer", response)
          break;
        default:
          return;
      }

      if (!response.ok) throw new Error("Erreur lors de l'action");

      const result = await response.json();
      toast.success(result.message);
      setShowAlarmModal(false);
    } catch (error) {
      console.error("Erreur lors de l'action :", error);
      toast.error("Une erreur s'est produite.");
    }
  };
  <ToastContainer />
//fin alarme

  const {
    text: speechToText,
    isListening: isSpeechListening,
    error: speechError,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening,
    handleTextChange,
  } = useSpeechToText(handleSubmit);

  useEffect(() => {
    setSpeechText(speechToText);
  }, [speechToText]);

  const handleMicrophoneClick = useCallback(() => {
    if (isListening || isSpeechListening) {
      stopListening();
      stopSpeechListening();
    } else {
      startSpeechListening();
    }
  }, [isListening, isSpeechListening, stopListening, stopSpeechListening, startSpeechListening]);


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
          {responseText && <ResponseDisplay textreponse={responseText} />}
        </AnimatePresence>

        <SpeechTextArea
          speechText={speechText}
          isSpeechListening={isSpeechListening}
          handleTextChange={(e) => {
            handleTextChange(e);
            setSpeechText(e.target.value);
          }}
          setSpeechText={setSpeechText}
        />
        <SubmitButton speechText={speechText} onSubmit={() => handleSubmit(speechText)} />
        <AnimatePresence>
          {showResponseTextarea && results && results.data && (
            <motion.div
              className="w-full p-4 border rounded-lg shadow-sm focus:outline-none text-black focus:ring-2 focus:ring-blue-500 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 1.4 }}
            >
              <p className="text-lg font-semibold mb-4 text-gray-950">{responseText}</p>
              {results.type === "exact" && results.data && isReglage(results.data) ? (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold text-gray-800">Détails du réglage</h2>
                  <p className="text-gray-600">Instrument : {results.data.instrument}</p>
                  <p className="text-gray-600">Réglage : {results.data.reglage}</p>
                  <p className="text-gray-600">Action : {results.data.action}</p>
                  {results.data.description && (
                    <p className="text-gray-600">Description : {results.data.description}</p>
                  )}
                </div>
              ) : (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <p className="text-gray-600">Aucune information disponible pour ce niveau </p>
                </div>
              )}
              {results.type === "alarme" && results.data && isAlarme(results.data) && (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold text-gray-800">Détails de l&apos;alarme</h2>
                  <p className="text-gray-600">Nom : {results.data.nom}</p>
                  <p className="text-gray-600">Description : {results.data.description}</p>
                  <p className="text-gray-600">Conséquence : {results.data.consequence}</p>
                  {results.data.instructions && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">Instructions :</h3>
                      <ul>
                        {results.data.instructions.map((instruction, index) => (
                          <li key={index} className="text-gray-600">
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.data.Parametre && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">Paramètres :</h3>
                      <ul>
                        {results.data.Parametre.map((parametre, index) => (
                          <li key={index} className="text-gray-600">
                            {parametre.nom} : {parametre.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {results.type === "range" && results.data && typeof results.data === "object" && (
                <>
                  {"niveauInferieur" in results.data && "niveauSuperieur" in results.data && results.data.niveauInferieur && results.data.niveauSuperieur && (
                    <>
                      <ReglageDetail reglage={results.data.niveauInferieur as ReglageDetailType} />
                      <ReglageDetail reglage={results.data.niveauSuperieur as ReglageDetailType} />
                    </>
                  )}
                </>
              )}
              {results.type === "all" && (
                <NiveauxList
                  niveaux={Object.values(results.data).filter(
                    (item) => item && item.id
                  ) as Niveau[]}
                />
              )}
              {results.type === "regroupements" && (
                <RegroupementsList
                  regroupements={Object.values(results.data).filter(
                    (item) => item && item.nom
                  ) as Regroupement[]}
                />
              )}

              {(results.type === "ConditionDemarrage" ||
                results.type === "ConditionDeclenchement" ||
                results.type === "ConditionOuverture" ||
                results.type === "ConditionFermeture") && (
                  <ConditionsList conditions={results.data as ConditionsListType} />
                )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Intégration du composant AlarmModal */}
        {showAlarmModal && alarmModalData && (
          <AlarmModal
            isOpen={showAlarmModal}
            onClose={() => setShowAlarmModal(false)}
            message={alarmModalData.message}
            actions={alarmModalData.actions}
            onAction={(action, newMotCle) => handleAlarmAction(action, newMotCle)}
          />
        )}
      
      </main>
    </div>
  );
};

export default HomePage;


