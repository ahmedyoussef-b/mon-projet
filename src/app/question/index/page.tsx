// Path: /src/app/question/index/page.tsx

import { useState } from 'react';
import { prisma } from '../../../lib/prisma'; // Assure-toi d'avoir configuré Prisma
import { useRouter } from 'next/router';

const QuestionForm = () => {
    const [question, setQuestion] = useState<string>('');
    const [responses, setResponses] = useState<{ content: string, imageUrl: string }[]>([]);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Sauvegarder la question dans la base de données
            const newQuestion = await prisma.question.create({
                data: {
                    content: question,
                    reponse: {
                        create: responses.map((resp) => ({
                            content: resp.content,
                            imageUrl: resp.imageUrl,
                        })),
                    },
                },
            });

            // Redirection vers la page de la question
            router.push(`/question/${newQuestion.id}`);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la question :", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ajouter une question</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question" className="block text-lg mb-2">Question :</label>
                    <input
                        type="text"
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-2 border rounded mb-4"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="reponses" className="block text-lg mb-2">Réponses :</label>
                    {responses.map((resp, index) => (
                        <div key={index} className="mb-4">
                            <input
                                type="text"
                                placeholder="Contenu de la réponse"
                                value={resp.content}
                                onChange={(e) => {
                                    const newResponses = [...responses];
                                    newResponses[index].content = e.target.value;
                                    setResponses(newResponses);
                                }}
                                className="w-full px-4 py-2 border rounded mb-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="URL de l'image (facultatif)"
                                value={resp.imageUrl}
                                onChange={(e) => {
                                    const newResponses = [...responses];
                                    newResponses[index].imageUrl = e.target.value;
                                    setResponses(newResponses);
                                }}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setResponses([...responses, { content: '', imageUrl: '' }])}
                        className="px-4 py-2 bg-gray-200 rounded mt-2"
                    >
                        Ajouter une réponse
                    </button>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default QuestionForm;
