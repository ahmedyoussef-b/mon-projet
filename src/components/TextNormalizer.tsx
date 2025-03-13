// components/TextNormalizer.tsx
import React from "react";

interface TextNormalizerProps {
    text: string;
    onNormalized: (normalizedText: string) => void;
}

const TextNormalizer: React.FC<TextNormalizerProps> = ({ text, onNormalized }) => {
    const normalizeText = (inputText: string): string => {
        return inputText
            .trim() // Supprime les espaces en début et fin de chaîne
            .toLowerCase() // Convertit en minuscules
            .replace(/\s+/g, " "); // Remplace les espaces multiples par un seul espace
    };

    // Normalise le texte dès que le composant est rendu ou que le texte change
    React.useEffect(() => {
        const normalizedText = normalizeText(text);
        onNormalized(normalizedText);
    }, [text, onNormalized]);

    return null; // Ce composant ne rend rien visuellement
};

export default TextNormalizer;