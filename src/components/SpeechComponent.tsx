// src/components/SpeechComponent.tsx
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const SpeechComponent = () => {
    const { text, isListening, isVocalMode, enableVocalMode, disableVocalMode } = useSpeechRecognition();

    return (
        <div>
            <h1>Reconnaissance vocale</h1>
            {/* Affichage conditionnel du mode vocal */}
            <p>{isVocalMode ? "Mode vocal activé" : "Mode vocal désactivé"}</p>
            <p>{text}</p>

            <div>
                {!isVocalMode && <button onClick={enableVocalMode}>Activer le mode vocal</button>}
                {isVocalMode && <button onClick={disableVocalMode}>Désactiver le mode vocal</button>}
            </div>

            {/* Affichage si l'écoute est activée */}
            {isListening && <p>Écoute en cours...</p>}
        </div>
    );
};

export default SpeechComponent;
