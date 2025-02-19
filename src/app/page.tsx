// /src/app/page.tsx
"use client";
import Link from "next/link";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SpeechToText from "@/hooks/SpeechToText";
import SpeechToDatabase from "@/components/SpeechToDatabase";
import SpeechComponent from "@/components/SpeechComponent";

export default function HomePage() {
  const { text, isListening, startListening, stopListening } = useSpeechRecognition();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Copilot Centrale</h1>
        <div className="flex gap-4">
          <Link href="/manoeuvres">
            <button className="btn btn-primary">Manœuvres</button>
          </Link>
          <Link href="/alarmes">
            <button className="btn btn-primary">Alarmes</button>
          </Link>
          <Link href="/rapports">
            <button className="btn btn-primary">Rapports</button>
          </Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="grid grid-cols-3 gap-4 p-6 max-w-6xl mx-auto w-full">
        {/* Colonne 1 - Contrôle vocal */}
        <div className="col-span-1 space-y-4">
          <button
            className={`btn w-full ${isListening ? "btn-error" : "btn-primary"}`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? "Désactiver l'écoute ❌" : "Activer l'écoute 🎙️"}
          </button>

          <div className={`text-center font-semibold text-lg ${isListening ? "text-green-500" : "text-red-500"}`}>
            {isListening ? "Microphone Activé 🎤" : "Microphone Désactivé 🚫"}
          </div>

          {text && (
            <div className="bg-gray-800 p-4 rounded-lg text-lg text-white shadow-md">
              🗣️ {text}
            </div>
          )}
        </div>

        {/* Colonne 2 - Composants vocaux */}
        <div className="col-span-1 space-y-4">
          <SpeechComponent />
          <SpeechToDatabase />
        </div>

        {/* Colonne 3 - Transcription */}
        <div className="col-span-1 space-y-4">
          <SpeechToText />
        </div>
      </main>
    </div>
  );
}
