"use client";
import { motion } from "framer-motion";

interface QuestionDisplayProps {
    text: string;
}

export default function QuestionDisplay({ text }: QuestionDisplayProps) {
    return (
        <motion.div
            className="btn bg-blue-500 p-4 rounded-lg text-lg text-white shadow-md mb-4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
            ❓ Question : {text}
        </motion.div>
    );
}