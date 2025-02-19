// /src/components/Sidebar.tsx
import Link from "next/link";

const Sidebar = () => {
    return (
        <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-full p-4">
            <nav className="flex flex-col space-y-4">
                <Link href="/" className="block p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-center">
                    Home
                </Link>
                <Link href="/manoeuvres" className="block p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-center">
                    Manœuvres
                </Link>
                <Link href="/alarmes" className="block p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-center">
                    Alarmes
                </Link>
                <Link href="/rapports" className="block p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-center">
                    Rapports
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
