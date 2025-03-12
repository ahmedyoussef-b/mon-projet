import React from "react";

interface SpeechTextAreaProps {
    speechText: string;
    isSpeechListening: boolean;
    handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setSpeechText: (text: string) => void;
}

const SpeechTextArea: React.FC<SpeechTextAreaProps> = ({
    speechText,
    isSpeechListening,
    handleTextChange,
    setSpeechText,
}) => (
    <div className="relative w-full">
        <textarea
            className="w-full p-4 border rounded-lg text-neutral-900 font-bold text-lg flex justify-center items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"            placeholder={isSpeechListening ? "Parlez maintenant..." : "Saisissez votre texte ici..."}
            value={speechText}
            onChange={handleTextChange}
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
);

export default SpeechTextArea;