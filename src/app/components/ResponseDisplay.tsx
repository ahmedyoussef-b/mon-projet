"use client";
import { motion } from "framer-motion";

interface ResponseDisplayProps {
    textreponse: string;
}

export default function ResponseDisplay({ textreponse }: ResponseDisplayProps) {
    return (
        <motion.div
            className="bg-orange-500 p-4 rounded-lg text-lg text-black shadow-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
            🗣️ Réponse : {textreponse}
        </motion.div>
    );
}