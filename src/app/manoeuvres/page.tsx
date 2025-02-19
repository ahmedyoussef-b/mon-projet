// /src/pages/manoeuvres/page.tsx
import Sidebar from "@/components/Sidebar";

export default function ManoeuvresPage() {
    return (
        <div className="page-container">
            <Sidebar />
            <div className="content">
                <h1>Page des Manœuvres</h1>
                <p>Bienvenue dans la page des manœuvres.</p>
            </div>
        </div>
    );
}
