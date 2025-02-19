// src/components/SpeechComponent.tsx
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const SpeechComponent = () => {
    const { text, isListening, startListening, stopListening } = useSpeechRecognition();

    return (
        <div>
            <h1>Reconnaissance vocale</h1>
            <p>{text}</p>

            <div>
                {!isListening && <button onClick={startListening}>Activer l&apos;écoute</button>}
                {isListening && <button onClick={stopListening}>Désactiver l&apos;écoute</button>}
            </div>

            {isListening && <p>Écoute en cours...</p>}
        </div>
    );
};

export default SpeechComponent;
