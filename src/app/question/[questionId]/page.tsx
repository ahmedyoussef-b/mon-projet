// Path: /src/app/question/[questionId]/page.tsx
{/*}
import { GetServerSideProps } from 'next';
import { prisma } from '../../../lib/prisma'; // Assure-toi d'avoir configuré Prisma
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Reponse {
    content: string;
    imageUrl: string;
}

interface QuestionProps {
    questionContent: string;
    responses: Reponse[];
}

const QuestionPage = ({ questionContent, responses }: QuestionProps) => {
    const [showResponse, setShowResponse] = useState<boolean>(false);

    // Fonction pour gérer la synthèse vocale des réponses
    const speakResponses = (responses: { content: string }[]) => {
        const synth = window.speechSynthesis;
        synth.cancel(); // Annuler toute lecture en cours

        responses.forEach((resp, index) => {
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(resp.content);
                utterance.lang = "fr-FR"; // Langue de la synthèse vocale
                synth.speak(utterance);
            }, index * 3000); // Délai pour chaque réponse (3 secondes entre chaque)
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{questionContent}</h1>

            <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setShowResponse(!showResponse)}
            >
                {showResponse ? "Cacher les réponses" : "Afficher les réponses"}
            </button>

            {showResponse && (
                <motion.div
                    className="w-full p-4 border rounded-lg bg-white mt-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                >
                    <h3 className="font-semibold text-lg mb-2">Réponses :</h3>
                    <ul className="list-none">
                        {responses.map((resp, index) => (
                            <li key={index} className="mb-4 flex items-center">
                                <img
                                    src={resp.imageUrl}
                                    alt="Illustration"
                                    className="w-16 h-16 rounded mr-4"
                                />
                                <p className="text-gray-700">{resp.content}</p>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => speakResponses(responses)} // Synthèse vocale
                    >
                        🔊 Écouter les réponses
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { questionId } = context.query;

    // Récupérer la question et ses réponses associées
    const question = await prisma.question.findUnique({
        where: { id: String(questionId) },
        include: { reponse: true },
    });

    // Si la question n'existe pas, renvoyer une page d'erreur
    if (!question) {
        return {
            notFound: true,
        };
    }

    // Retourner la question et ses réponses
    const responses = question.reponse.map((r) => ({
        content: r.content,
        imageUrl: r.imageUrl || "/images/default.png", // Image par défaut si aucune image n'est définie
    }));

    return {
        props: {
            questionContent: question.content,
            responses,
        },
    };
};

export default QuestionPage;
*/}