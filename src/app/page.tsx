// /src/app/page.tsx

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  const { text, isListening, enableVocalMode, disableVocalMode } = useSpeechRecognition();
  const [isVocalModeActive, setIsVocalModeActive] = useState<boolean>(false);

  const handleVocalModeToggle = () => {
    if (isVocalModeActive) {
      disableVocalMode();
    } else {
      enableVocalMode();
    }
    setIsVocalModeActive(!isVocalModeActive);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen justify-center items-center ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Copilot Centrale
        </h1>

        {/* Bouton pour activer/désactiver le mode vocal */}
        <button
          className="btn button-add w-full lg:w-auto mx-auto lg:mx-0"
          onClick={handleVocalModeToggle}
        >
          {isVocalModeActive ? "Désactiver Mode Vocal" : "Passer en Mode Vocal"}
        </button>

        {/* Indicateur de statut du microphone */}
        <div
          className={`text-center font-semibold ${isListening ? "text-green-400" : "text-red-400"
            }`}
        >
          {isListening ? "Microphone Activé 🎙️" : "Microphone Désactivé ❌"}
        </div>

        {/* Affichage de la transcription */}
        {text && (
          <div className="bg-gray-800 p-4 rounded-lg text-lg text-white">
            🗣️ {text}
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link href="/manoeuvres">
            <button className="btn w-full sm:w-auto">Manœuvres</button>
          </Link>
          <Link href="/alarmes">
            <button className="btn w-full sm:w-auto">Alarmes</button>
          </Link>
          <Link href="/rapports">
            <button className="btn w-full sm:w-auto">Rapports</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
