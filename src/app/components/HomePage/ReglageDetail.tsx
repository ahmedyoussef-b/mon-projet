//src/app/components/HomePage/ReglageDetail.tsx
import React from "react";
import { Reglage } from "@/app/types/types";

interface ReglageDetailProps {
    reglage: Reglage;

}

const ReglageDetail: React.FC<ReglageDetailProps> = ({ reglage }) => (
    <div className="mb-4">
        <h3 className="text-xl font-bold">{reglage.reglage}</h3>
        {reglage.action && <p>{reglage.action}</p>}
        {reglage.description && <p>{reglage.description}</p>}
    </div>
);

export default ReglageDetail;