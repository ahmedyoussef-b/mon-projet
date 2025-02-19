// /src/pages/rapports/page.tsx
import Sidebar from "@/components/Sidebar";

export default function RapportsPage() {
    return (
        <div className="page-container">
            <Sidebar />
            <div className="content">
                <h1>Page des Rapports</h1>
                <p>Bienvenue dans la page des rapports.</p>
            </div>
        </div>
    );
}
