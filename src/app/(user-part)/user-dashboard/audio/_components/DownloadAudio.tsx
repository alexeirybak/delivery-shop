import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useTextToAudioSettingsStore } from "@/store/textToAudioSettingsStore";

interface DownloadAudioProps {
  text: string;
  disabled?: boolean;
  className?: string;
  onAudioReady?: (audioUrl: string) => void;
}

const MAX_TEXT_LENGTH = 5000;

export const DownloadAudio = ({
  text,
  disabled = false,
  className = "",
  onAudioReady,
}: DownloadAudioProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useTextToAudioSettingsStore();

  const handleDownload = async () => {
    if (!text.trim()) return;

    if (text.length > MAX_TEXT_LENGTH) {
      alert(
        `Текст слишком длинный. Максимум ${MAX_TEXT_LENGTH} символов. Сейчас ${text.length} символов.`,
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/tts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: settings.voiceId,
          speed: settings.speed,
          language: settings.language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "TTS failed");
      }

      const data = await response.json();
      
      if (onAudioReady && data.audioUrl) {
        onAudioReady(data.audioUrl);
      }
      
      const downloadResponse = await fetch(data.audioUrl);
      const blob = await downloadResponse.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Озвучка_${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Ошибка при создании аудиофайла");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isLoading || !text.trim()}
      className={`download-audio-btn ${className}`}
      title="Скачать MP3"
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      <span>Озвучить и скачать MP3</span>
    </button>
  );
};