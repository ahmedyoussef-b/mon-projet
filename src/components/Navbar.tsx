// /src/components/Navbar.tsx
"use client"
import Link from "next/link";

const Navbar = () => {

    return (
       
           <div className="flex flex-col items-center gap-3 mt-6
           ">
                <nav  className="flex justify-between">
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
        </div>
    );
};

export default Navbar;
