// /src/app/page.tsx
"use client";
import SpeechToTextTest from "@/hooks/SpeechToTextTest";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function HomePage() {
  const { text, isListening, startListening, stopListening } = useSpeechRecognition();

  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full items-center m-5">
      
      {/* Contenu principal */}
      <main className="grid grid-cols-2 gap-4 p-6 max-w-6xl mx-auto w-full bg-transparent">
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
            <div className="bg-slate-50 p-4 rounded-lg text-lg text-white shadow-md">
              🗣️ {text} 
            </div>
          )}

          
        <SpeechToTextTest/>
        
        </div>
      </main>
    </div>
  );
}


