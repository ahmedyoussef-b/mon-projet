// Path: src/app/page.tsx
"use client"
import { useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

export default function Home() {
  const { text, isListening, enableVocalMode, disableVocalMode } = useSpeechRecognition();
  const [isVocalModeEnabled, setIsVocalModeEnabled] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Bienvenue</h1>
      <p>Microphone : {isListening ? "Écoute en cours..." : "Non actif"}</p>
      <p className="mt-2">{text}</p>

      <button
        onClick={() => {
          if (!isVocalModeEnabled) {
            enableVocalMode();
            setIsVocalModeEnabled(true);
          } else {
            disableVocalMode();
            setIsVocalModeEnabled(false);
          }
        }}
        className={`mt-4 px-4 py-2 ${isVocalModeEnabled ? "bg-red-500" : "bg-blue-500"} text-white rounded`}
      >
        {isVocalModeEnabled ? "Désactiver Mode Vocal" : "Activer Mode Vocal"}
      </button>
    </div>
  );
}
