// src/app/niveaux/[niveau]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Reglage = {
    id: number;
    niveau: number;
    instrument: string;
    action: string;
};

export default function NiveauDetailPage() {
    const { niveau } = useParams();
    const [details, setDetails] = useState<Reglage | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`/api/niveaux/${niveau}`);
                if (!response.ok) throw new Error("Niveau non trouvé");

                const data = await response.json();
                setDetails(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        if (niveau) fetchDetails();
    }, [niveau]);

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Détails du Niveau {niveau}</h1>

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : details ? (
                <div className="p-6 border rounded-lg shadow-md w-full max-w-md">
                    <p><strong>Instrument :</strong> {details.instrument}</p>
                    <p><strong>Action :</strong> {details.action}</p>
                </div>
            ) : (
                <p>Chargement des détails...</p>
            )}

            <Link href="/niveaux" className="mt-4 text-blue-600 hover:underline">
                Retour à la liste des niveaux
            </Link>
        </div>
    );
}
