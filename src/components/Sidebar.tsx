// /src/components/Sidebar.tsx
"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icônes pour le menu

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Bouton Menu (Hamburger) pour mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full p-4 transform 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform md:translate-x-0 md:block`}
            >
                <nav className="flex flex-col space-y-4">
                    <Link href="/" className="block p-2 bg-orange-400 hover:bg-blue-600 rounded-md text-center">
                        Home
                    </Link>
                    <Link href="/manoeuvres" className="block p-2 bg-red-800 hover:bg-blue-600 rounded-md text-center">
                        Manœuvres
                    </Link>
                    <Link href="/alarmes" className="block p-2 bg-lime-500 hover:bg-blue-600 rounded-md text-center">
                        Alarmes
                    </Link>
                    <Link href="/rapports" className="block p-2 bg-blue-700 hover:bg-blue-600 rounded-md text-center">
                        Rapports
                    </Link>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
