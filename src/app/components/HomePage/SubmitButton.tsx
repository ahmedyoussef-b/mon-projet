import React from "react";

interface SubmitButtonProps {
    speechText: string;
    onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ speechText, onSubmit }) => (
    <button
        type="button"
        className={`px-4 py-2 mt-4 rounded ${speechText.trim() ? "bg-green-500 text-black" : "bg-gray-400 text-black cursor-not-allowed"}`}
        onClick={onSubmit}
        disabled={!speechText.trim()}
        aria-label="Soumettre"
    >
        Soumettre
    </button>
);

export default SubmitButton;