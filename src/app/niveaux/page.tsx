// src/app/niveaux/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Niveau = {
    id: number;
    niveau: number;
};

export default function NiveauxPage() {
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/niveaux");
                if (!response.ok) throw new Error("Erreur lors du chargement des niveaux");

                const data = await response.json();
                setNiveaux(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Une erreur inconnue s'est produite.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des Niveaux</h1>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <ul className="w-full max-w-md space-y-2">
                    {niveaux.length > 0 ? (
                        niveaux.map((niveau) => (
                            <li key={niveau.id} className="p-4 border rounded-lg shadow-md hover:bg-gray-100 transition">
                                <Link
                                    href={`/niveaux/${niveau.niveau}`}
                                    className="text-blue-600 hover:underline"
                                    aria-label={`Voir les détails du niveau ${niveau.niveau}`}
                                >
                                    Niveau {niveau.niveau}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p>Aucun niveau disponible.</p>
                    )}
                </ul>
            )}
        </div>
    );
}