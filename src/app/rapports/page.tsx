// /src/app/rapports/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RapportsPage() {
  const searchParams = useSearchParams();
  const [responses, setResponses] = useState<{ content: string; createdAt: string }[]>([]);

  useEffect(() => {
    if (!searchParams) return; // Vérifier si searchParams est null

    const id = searchParams.get("id");
    if (id) {
      // Récupérer les réponses à partir de l'ID
      fetch(`/api/store-responses?id=${id}`)
        .then((res) => res.json())
        .then((data) => setResponses(data.responses))
        .catch((error) => console.error("Erreur lors de la récupération des réponses :", error));
    }
  }, [searchParams]);

  if (!searchParams) {
    return <div className="p-4 text-red-500">Erreur : Impossible de charger les paramètres de recherche.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rapport des réponses</h1>
      {responses.length > 0 ? (
        <ul>
          {responses.map((rep, index) => (
            <li key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
              <p className="text-gray-700"><strong>Réponse {index + 1} :</strong></p>
              <p className="mt-2">{rep.content}</p>
              <p className="text-sm text-gray-500">
                Date : {new Date(rep.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune réponse disponible.</p>
      )}
    </div>
  );
}