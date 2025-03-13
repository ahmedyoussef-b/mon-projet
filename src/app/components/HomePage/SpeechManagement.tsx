//src/app/components/HomePage/SpeechManagement.tsx
"use client";

import React from "react";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/app/hooks/useTextToSpeech";
import { useSpeechToText } from "@/app/hooks/useSpeechToText";
import MicrophoneButton from "./MicrophoneButton";
import MicrophoneStatus from "./MicrophoneStatus";
import ErrorDisplay from "./ErrorDisplay";

interface SpeechManagementProps {
    onSpeechSubmit: (text: string) => void;
}

const SpeechManagement = ({ onSpeechSubmit }: SpeechManagementProps) => {
    const { isListening, error: recognitionError, stopListening } = useSpeechRecognition();
    const { stopSpeaking, isSpeaking } = useTextToSpeech();
    const {
        isListening: isSpeechListening,
        error: speechError,
        startListening: startSpeechListening,
        stopListening: stopSpeechListening,
    } = useSpeechToText(onSpeechSubmit);

    const handleMicrophoneClick = () => {
        if (isListening || isSpeechListening) {
            stopListening();
            stopSpeechListening();
        } else {
            startSpeechListening();
        }
    };

    return (
        <>
            <MicrophoneButton isListening={isListening || isSpeechListening} onClick={handleMicrophoneClick} />
            <MicrophoneStatus isListening={isListening || isSpeechListening} />
            <ErrorDisplay error={recognitionError || speechError} />
            {isSpeaking && (
                <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Arrêter la lecture
                </button>
            )}
        </>
    );
};

export default SpeechManagement;