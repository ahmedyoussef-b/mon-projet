//src/app/components/ImageUploader.tsx :

{/*}

"use client";
import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { SpellcheckerWasm } from "spellchecker-wasm"; // Utilisation de spellchecker-wasm

export default function ImageUploader() {
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [spellChecker, setSpellChecker] = useState<SpellChecker | null>(null); // Stocker l'instance de SpellChecker

    // Initialiser le correcteur orthographique avec spellchecker-wasm
    useEffect(() => {
        const initializeSpellChecker = async () => {
            try {
                // Créer une instance de SpellChecker
                const checker = new SpellChecker();

                // Charger un dictionnaire (ex: anglais)
                await checker.loadDictionary("en_US");

                setSpellChecker(checker);
            } catch (error) {
                console.error("Erreur lors de l'initialisation du correcteur orthographique :", error);
            }
        };

        initializeSpellChecker();
    }, []);

    // Gérer l'upload de l'image
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // Envoyer l’image au backend pour optimisation
            const response = await fetch("/api/process-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.imagePath) {
                setImage(data.imagePath);
            }
        } catch (error) {
            console.error("Erreur d'upload :", error);
        } finally {
            setLoading(false);
        }
    };

    // Effectuer la reconnaissance OCR et corriger le texte
    const handleOCR = async () => {
        if (!image || !spellChecker) return;

        setLoading(true);

        try {
            // Reconnaissance OCR avec Tesseract
            const { data } = await Tesseract.recognize(image, "eng+fra+ara");

            // Correction orthographique avec spellchecker-wasm
            const correctedText = data.text
                .split(" ")
                .map((word) => {
                    if (spellChecker.check(word)) {
                        return word; // Mot correct
                    } else {
                        const suggestions = spellChecker.suggest(word);
                        return suggestions[0] || word; // Utiliser la première suggestion ou garder le mot original
                    }
                })
                .join(" ");

            setText(correctedText);
        } catch (error) {
            console.error("Erreur OCR :", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="mb-4"
            />
            {loading && <p className="text-gray-600">Traitement en cours...</p>}
            {image && (
                <img
                    src={image}
                    alt="Uploaded"
                    className="w-60 mt-2 border rounded shadow"
                />
            )}
            <button
                onClick={handleOCR}
                disabled={!image || loading}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                Lire l’image
            </button>
            {text && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <p className="text-gray-800">{text}</p>
                </div>
            )}
        </div>
    );
}

*/}