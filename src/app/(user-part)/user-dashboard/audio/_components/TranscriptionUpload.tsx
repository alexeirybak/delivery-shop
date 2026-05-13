import { useState, useRef } from "react";
import { Upload, FileAudio, Loader2, X, Sparkles } from "lucide-react";
import { useTranscriptionSettingsStore } from "@/store/transcriptionSettingsStore";
import "../styles/transcription-upload.css";

interface TranscriptionUploadProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const TranscriptionUpload = ({
  onTranscriptionComplete,
  disabled,
}: TranscriptionUploadProps) => {
  const { settings } = useTranscriptionSettingsStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [showFormatButton, setShowFormatButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = /\.(ogg|mp3|wav)$/i;
    const allowedTypes = [
      "audio/ogg",
      "audio/mpeg",
      "audio/wav",
      "audio/x-wav",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.test(file.name)
    ) {
      alert("Поддерживаются форматы: OGG (OggOpus), MP3, WAV");
      return;
    }

    setSelectedFile(file);
    setRecognizedText("");
    setShowFormatButton(false);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setRecognizedText("");
    setShowFormatButton(false);

    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("language", settings.language);

    try {
      const startRes = await fetch("/api/transcription/start", {
        method: "POST",
        body: formData,
      });

      const { operationId, fileName } = await startRes.json();

      let text = "";
      let attempts = 0;

      while (attempts < 720) {
        await new Promise((r) => setTimeout(r, 5000));
        attempts++;

        const statusRes = await fetch(
          `/api/transcription/status?operationId=${operationId}&fileName=${fileName}`,
        );

        const data = await statusRes.json();

        if (data.done) {
          text = data.text;
          break;
        }
      }

      if (!text) {
        throw new Error("Не удалось распознать");
      }

      setRecognizedText(text);
      setShowFormatButton(true);
    } catch (error) {
      console.error(error);
      alert("Ошибка транскрибации");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormat = async () => {
    if (!recognizedText) return;

    setIsFormatting(true);

    try {
      const formatResponse = await fetch("/api/gpt/yandex-cloud/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: recognizedText,
          mode: "transcription",
          stream: false,
        }),
      });

      const formatData = await formatResponse.json();
      const formattedText = formatData.text || recognizedText;

      setRecognizedText(formattedText);
      setShowFormatButton(false);
      onTranscriptionComplete(formattedText);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка форматирования");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleUseText = () => {
    if (recognizedText) {
      onTranscriptionComplete(recognizedText);
      setSelectedFile(null);
      setRecognizedText("");
      setShowFormatButton(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setRecognizedText("");
    setShowFormatButton(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (disabled) return null;

  return (
    <div className="transcription-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".ogg,.mp3,.wav,audio/ogg,audio/mpeg,audio/wav"
        onChange={handleFileSelect}
        className="transcription-file-input"
        id="transcription-file"
        disabled={isProcessing || isFormatting}
      />
      <label
        htmlFor="transcription-file"
        className="transcription-upload-label"
      >
        <FileAudio size={18} />
        <span>Загрузить аудио (OGG, MP3, WAV)</span>
      </label>

      {selectedFile && !recognizedText && (
        <div className="transcription-preview">
          <div className="transcription-file-info">
            <FileAudio size={14} />
            <span>{selectedFile.name}</span>
            <span className="transcription-file-size">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <div className="transcription-actions">
            <button
              onClick={handleTranscribe}
              disabled={isProcessing}
              className="transcription-submit-btn"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Транскрибация...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Распознать</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="transcription-cancel-btn"
              disabled={isProcessing}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {recognizedText && (
        <div className="transcription-result">
          <div className="transcription-result-text">
            <p>{recognizedText}</p>
          </div>
          <div className="transcription-result-actions">
            <button
              onClick={handleUseText}
              className="transcription-use-btn"
            >
              Использовать
            </button>
            {showFormatButton && (
              <button
                onClick={handleFormat}
                disabled={isFormatting}
                className="transcription-format-btn"
              >
                {isFormatting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>Отформатировать</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};