import { useState } from "react";

export function useQuestionAndReponse() {
  const [question, setQuestion] = useState("");
  const [reponse, setReponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmitQuestion = async () => {
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        body: JSON.stringify({ question }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        console.log("Question ajoutée :", data);
      }
    } catch (err) {
      console.error("Erreur lors de la soumission de la question", err);
    }
  };

  const handleSubmitReponse = async () => {
    try {
      const res = await fetch("/api/reponse", {
        method: "POST",
        body: JSON.stringify({ questionId: "123", reponse }), // Assure-toi d'envoyer l'ID de la question
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        console.log("Réponse ajoutée :", data);
      }
    } catch (err) {
      console.error("Erreur lors de la soumission de la réponse", err);
    }
  };

  return {
    question,
    setQuestion,
    reponse,
    setReponse,
    handleSubmitQuestion,
    handleSubmitReponse,
    error,
  };
}
