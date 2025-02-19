import React from "react";
import { useQuestionAndReponse } from "@/hooks/useQuestionAndReponse";

const QuestionForm = () => {
    const {
        question,
        setQuestion,
        reponse,
        setReponse,
        handleSubmitQuestion,
        handleSubmitReponse,
        error,
    } = useQuestionAndReponse();

    return (
        <div>
            <h2>Poser une Question</h2>
            <input
                type="text"
                placeholder="Entrez votre question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleSubmitQuestion}>Soumettre la Question</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Ajouter une Réponse</h2>
            <input
                type="text"
                placeholder="Entrez la réponse"
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
            />
            <button onClick={handleSubmitReponse}>Soumettre la Réponse</button>
        </div>
    );
};

export default QuestionForm;
