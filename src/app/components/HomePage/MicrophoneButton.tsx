"use client";
import { motion } from "framer-motion";

interface MicrophoneButtonProps {
    isListening: boolean;
    onClick: () => void;
}

export default function MicrophoneButton({ isListening, onClick }: MicrophoneButtonProps) {
    return (
        <motion.button
            className={`btn w-full ${isListening ? "btn-error" : "btn-primary"}`}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: isListening ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label={isListening ? "Désactiver l'écoute" : "Activer l'écoute"}
            role="button"
        >
            {isListening ? "Désactiver l'écoute ❌" : "Activer l'écoute 🎙️"}
        </motion.button>
    );
}