import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useVoiceSettingsStore } from "@/store/voiceSettingsStore";
import "../styles/speak-button.css";

interface SpeakButtonProps {
  text: string;
  disabled?: boolean;
}

export const SpeakButton = ({ text, disabled }: SpeakButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { settings: voiceSettings } = useVoiceSettingsStore();

  const cleanTextForSpeech = (rawText: string): string => {
    let cleaned = rawText;
    
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); 
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');    
    cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');    
    cleaned = cleaned.replace(/`(.*?)`/g, '$1');     
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ''); 
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/[#*_~`>|\\]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1');
    cleaned = cleaned.replace(/([.!?])\1+/g, '$1');
    cleaned = cleaned.replace(/\n\s*\n/g, '\n');
    
    return cleaned.trim();
  };

  const handleSpeak = async () => {
    if (disabled || !text) return;

    if (isSpeaking && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    setIsLoading(true);
    
    const cleanedText = cleanTextForSpeech(text);
    
    if (!cleanedText.trim()) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanedText, voice: voiceSettings.voiceId }),  
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      audio.onplay = () => {
        setIsLoading(false);
        setIsSpeaking(true);
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
      };
      
      audio.onerror = () => {
        console.error("Ошибка проигрывания");
        setIsLoading(false);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
      };
      
      await audio.play();
    } catch (error) {
      console.error("Ошибка озвучивания:", error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={disabled || !text || isLoading}
      className="speak-btn"
      title={isSpeaking ? "Остановить" : "Озвучить"}
    >
      {isLoading ? (
        <div className="spinner-small" />
      ) : isSpeaking ? (
        <VolumeX size={18} />
      ) : (
        <Volume2 size={18} />
      )}
    </button>
  );
};