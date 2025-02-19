// /src/app/pages/alarmes/page.tsx
import Sidebar from "@/components/Sidebar";

export default function AlarmesPage() {
    return (
        <div className="page-container">
            <Sidebar />
            <div className="content">
                <h1>Page des alarmes</h1>
                <p>Bienvenue dans la page des alarmes.</p>
            </div>
        </div>
    );
}
