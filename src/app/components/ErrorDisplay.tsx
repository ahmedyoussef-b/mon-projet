"use client";
import { motion } from "framer-motion";

interface ErrorDisplayProps {
    error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
    if (!error) return null;

    return (
        <motion.div
            className="bg-red-500 p-4 rounded-lg text-lg text-white shadow-md mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            ❌ Erreur : {error}
        </motion.div>
    );
}