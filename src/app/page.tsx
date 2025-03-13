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
import RegroupementsList from "./components/HomePage/RegroupementsList";
import NiveauxList from "./components/HomePage/NiveauxList";
import { Niveau } from "@prisma/client";
import AlarmManagement from "./components/HomePage/AlarmManagement";


type RangeData = {
  niveauInferieur: Reglage;
  niveauSuperieur: Reglage;
};
type ResultData =
  | ReglagesListType
  | RegroupementsListType
  | AlarmesListType
  | ReglageDetailType
  | ConditionsListType
  | RangeData
  | Alarme // Ajouter le type Alarme
  | null;


const HomePage = () => {

  const [showResponseTextarea, setShowResponseTextarea] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [results, setResults] = useState<{ type: string; data: ResultData } | null>(null);
  const [speechText, setSpeechText] = useState("");
  const { text, isListening, error: recognitionError, stopListening } = useSpeechRecognition();
  const { speakText, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [selectedAlarme, setSelectedAlarme] = useState<string | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(true);
  const [alarmModalData, setAlarmModalData] = useState<{
    message: string;
    id:string;
    actions: string[];
    suggestion?: { mot: string };
  } | null>(null);

  // Type guard pour vérifier si un objet est de type Reglage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isReglage(data: any): data is Reglage {
    return (
      typeof data === "object" &&
      data !== null &&
      "instrument" in data &&
      "reglage" in data &&
      "action" in data &&
      "organeId" in data
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isAlarme(data: any): data is Alarme {
    return (
      typeof data === "object" &&
      data !== null &&
      "id" in data &&
      "nom" in data &&
      "description" in data &&
      "consequence" in data &&
      "instruction" in data &&
      "Parametre" in data
    );
  }
  useEffect(() => {
    if (results) { // Vérifiez que `results` n'est pas `null`
      console.log("Results after setting:", results);
      console.log("Is results.data an Alarme?", isAlarme(results.data));
    } else {
      console.log("Results is null.");
    }
  }, [results]); // Déclenchez cet effet chaque fois que `results` change


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
              type: "range",
              niveauInferieur: data.niveauInferieur,
              niveauSuperieur: data.niveauSuperieur,
            } as unknown as ResultData; // Utilisation de `as unknown` pour contourner l'erreur temporairement
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
            id:data.id,
            actions: ["corriger", "ajouter", "supprimer"], // Assurez-vous que ces actions sont définies
            suggestion: data.suggestion,
          });
          console.log("setalarme data", alarmModalData)
          console.log(showAlarmModal)
          setShowAlarmModal(true);
          setSelectedAlarme(data.suggestion?.mot || null);
          return;
        }

        if (data.type === "alarme") {
          setResults({
            type: "alarme",
            data: data.result, // Assurez-vous que data.result contient bien les détails de l'alarme
          });
          setResponseText(data.vocalMessage || `Détails de l'alarme "${data.result.nom}".`);
          speakText(data.vocalMessage || `Détails de l'alarme "${data.result.nom}".`);
        }


        // Gérer la réponse vocale
        if (data.type === "exact") {
          setResponseText(
            `Détails pour le niveau ${data.result?.reglage ?? "Inconnu"} : ${data.result?.description ?? "Aucune information disponible"}`
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
        <AlarmManagement
          selectedAlarme={selectedAlarme}
          onClose={() => setShowAlarmModal(false)}
          alarmModalData={alarmModalData}
        />

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

              {/* Affichage des résultats en fonction du type*/}
              {results.type === "exact" && results.data && isReglage(results.data) ? (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold text-gray-800">Détails du réglage</h2>
                  <p className="text-gray-600">Instrument : {results.data.instrument}</p>
                  <p className="text-gray-600">Réglage : {results.data.reglage}</p>
                  <p className="text-gray-600">Action : {results.data.action}</p>
                
                </div>
              ) : results.type === "alarme" && results.data && isAlarme(results.data) ? (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold text-gray-800">Détails de l&apos;alarme</h2>
                  <p className="text-gray-600">Nom : {results.data.nom}</p>
                  <p className="text-gray-600">Description : {results.data.description}</p>
                  <p className="text-gray-600">Conséquence : {results.data.consequence}</p>
                  {results.data.instruction && results.data.instruction.length > 0 ? (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">Instructions :</h3>
                      <ul>
                        {results.data.instruction.map((instruction, index) => (
                          <li key={index} className="text-gray-600">
                            {instruction.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600">Aucune instruction disponible.</p>
                  )}
                  {results.data.Parametre && results.data.Parametre.length > 0 ? (
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
                  ) : (
                    <p className="text-gray-600">Aucun paramètre disponible.</p>
                  )}
                </div>
              ) : results.type === "range" &&
                results.data &&
                typeof results.data === "object" &&
                "niveauInferieur" in results.data &&
                "niveauSuperieur" in results.data &&
                results.data.niveauInferieur &&
                results.data.niveauSuperieur ? (
                <>
                  <ReglageDetail reglage={results.data.niveauInferieur as ReglageDetailType} />
                  <ReglageDetail reglage={results.data.niveauSuperieur as ReglageDetailType} />
                </>
              ) : results.type === "all" ? (
                <NiveauxList
                  niveaux={Object.values(results.data).filter(
                    (item) => item && item.id
                  ) as Niveau[]}
                />
              ) : results.type === "regroupements" ? (
                <RegroupementsList
                  regroupements={Object.values(results.data).filter(
                    (item) => item && item.nom
                  ) as Regroupement[]}
                />
              ) : results.type === "ConditionDemarrage" ||
                results.type === "ConditionDeclenchement" ||
                results.type === "ConditionOuverture" ||
                results.type === "ConditionFermeture" ? (
                <ConditionsList conditions={results.data as ConditionsListType} />
              ) : (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <p className="text-gray-600">Aucune information disponible pour ce niveau</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Intégration du composant AlarmModal */}

      </main>
    </div>
  );
};

export default HomePage;
{/*}
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
import AlarmModal from '@/app/components/HomePage/AlarmModal'
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegroupementsList from "./components/HomePage/RegroupementsList";
import NiveauxList from "./components/HomePage/NiveauxList";
import { Niveau } from "@prisma/client";


type RangeData = {
  niveauInferieur: Reglage;
  niveauSuperieur: Reglage;
};
type ResultData =
  | ReglagesListType
  | RegroupementsListType
  | AlarmesListType
  | ReglageDetailType
  | ConditionsListType
  | RangeData
  | Alarme // Ajouter le type Alarme
  | null;


const HomePage = () => {

  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showResponseTextarea, setShowResponseTextarea] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [results, setResults] = useState<{ type: string; data: ResultData } | null>(null);
  const [speechText, setSpeechText] = useState("");
  const { text, isListening, error: recognitionError, stopListening } = useSpeechRecognition();
  const { speakText, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [selectedAlarme, setSelectedAlarme] = useState<string | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(true);
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
      "instrument" in data &&
      "reglage" in data &&
      "action" in data &&
      "organeId" in data
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
      "instruction" in data &&
      "Parametre" in data
    );
  }
  useEffect(() => {
    if (results) { // Vérifiez que `results` n'est pas `null`
      console.log("Results after setting:", results);
      console.log("Is results.data an Alarme?", isAlarme(results.data));
    } else {
      console.log("Results is null.");
    }
  }, [results]); // Déclenchez cet effet chaque fois que `results` change


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
              type: "range",
              niveauInferieur: data.niveauInferieur,
              niveauSuperieur: data.niveauSuperieur,
            } as unknown as ResultData; // Utilisation de `as unknown` pour contourner l'erreur temporairement
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
            actions: ["corriger", "ajouter", "supprimer"], // Assurez-vous que ces actions sont définies
            suggestion: data.suggestion,
          });
          setShowAlarmModal(true);
          setSelectedAlarme(data.suggestion?.mot || null);
          return;
        }

        if (data.type === "alarme") {
          setResults({
            type: "alarme",
            data: data.result, // Assurez-vous que data.result contient bien les détails de l'alarme
          });
          setResponseText(data.vocalMessage || `Détails de l'alarme "${data.result.nom}".`);
          speakText(data.vocalMessage || `Détails de l'alarme "${data.result.nom}".`);
        }


        // Gérer la réponse vocale
        if (data.type === "exact") {
          setResponseText(
            `Détails pour le niveau ${data.result?.reglage ?? "Inconnu"} : ${data.result?.description ?? "Aucune information disponible"}`
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

    try {
      let response;
      switch (action) {



        case "ajouter":

          response = await fetch("/api/alarme/ajouter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nom: selectedAlarme,
              description: "Description à définir",
              instruction: [],
              consequence: "Conséquence à définir",
              circuitId: 1,
              parametres: [],
            }),
          });
          break;
        case "supprimer":
          response = await fetch("/api/alarme/supprimer", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: selectedAlarme }),
          });
          break;
        default:
          return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'action");
      }

      const result = await response.json();
      toast.success(result.message);
      setShowAlarmModal(false);
    } catch (error) {
      console.error("Erreur lors de l'action :", error);
      toast.error( "Une erreur s'est produite.");
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
        <button
          onClick={() => setShowActionButtons(!showActionButtons)}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          {showActionButtons ? "Masquer les actions" : "Afficher les actions"}
        </button>
        {showActionButtons && (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => handleAlarmAction("ajouter")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Ajouter
            </button>
            <button
              onClick={() => handleAlarmAction("supprimer")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Supprimer
            </button>
            <button
              onClick={() => handleAlarmAction("corriger")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Corriger
            </button>
            <button
              onClick={() => handleAlarmAction("modifier")}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Modifier
            </button>
          </div>
        )}
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

              {/* Affichage des résultats en fonction du type
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
              ) : results.type === "alarme" && results.data && isAlarme(results.data) ? (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <h2 className="text-lg font-semibold text-gray-800">Détails de l&apos;alarme</h2>
                  <p className="text-gray-600">Nom : {results.data.nom}</p>
                  <p className="text-gray-600">Description : {results.data.description}</p>
                  <p className="text-gray-600">Conséquence : {results.data.consequence}</p>
                    {results.data.instruction && results.data.instruction.length > 0 ? (
                      <div>
                        <h3 className="text-md font-semibold text-gray-800">Instructions :</h3>
                        <ul>
                          {results.data.instruction.map((instruction, index) => (
                            <li key={index} className="text-gray-600">
                              {instruction.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-600">Aucune instruction disponible.</p>
                    )}
                    {results.data.Parametre && results.data.Parametre.length > 0 ? (
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
                    ) : (
                      <p className="text-gray-600">Aucun paramètre disponible.</p>
                    )}
                </div>
              ) : results.type === "range" &&
                results.data &&
                typeof results.data === "object" &&
                "niveauInferieur" in results.data &&
                "niveauSuperieur" in results.data &&
                results.data.niveauInferieur &&
                results.data.niveauSuperieur ? (
                <>
                  <ReglageDetail reglage={results.data.niveauInferieur as ReglageDetailType} />
                  <ReglageDetail reglage={results.data.niveauSuperieur as ReglageDetailType} />
                </>
              ) : results.type === "all" ? (
                <NiveauxList
                  niveaux={Object.values(results.data).filter(
                    (item) => item && item.id
                  ) as Niveau[]}
                />
              ) : results.type === "regroupements" ? (
                <RegroupementsList
                  regroupements={Object.values(results.data).filter(
                    (item) => item && item.nom
                  ) as Regroupement[]}
                />
              ) : results.type === "ConditionDemarrage" ||
                results.type === "ConditionDeclenchement" ||
                results.type === "ConditionOuverture" ||
                results.type === "ConditionFermeture" ? (
                <ConditionsList conditions={results.data as ConditionsListType} />
              ) : (
                <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                  <p className="text-gray-600">Aucune information disponible pour ce niveau</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Intégration du composant AlarmModal *
        {showAlarmModal && alarmModalData && (
          <AlarmModal
            isOpen={showAlarmModal}
            onClose={() => setShowAlarmModal(false)}
            message={alarmModalData?.message || "Message par défaut"}
            actions={alarmModalData?.actions || []}
            onAction={(action, newMotCle) => handleAlarmAction(action, newMotCle)}
          />
        )}

      </main>
    </div>
  );
};

export default HomePage;


{*/}