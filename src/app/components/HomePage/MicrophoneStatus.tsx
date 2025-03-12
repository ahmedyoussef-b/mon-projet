"use client";
import { motion } from "framer-motion";

interface MicrophoneStatusProps {
    isListening: boolean;
}

export default function MicrophoneStatus({ isListening }: MicrophoneStatusProps) {
    return (
        <motion.div
            className={`text-center font-semibold text-lg ${isListening ? "text-green-500" : "text-red-500"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            {isListening ? "Microphone Activé 🎤" : "Microphone Désactivé 🚫"}
        </motion.div>
    );
}