import { useState, useRef } from "react";
import { Upload, FileAudio, Loader2, X, Sparkles, Check } from "lucide-react";
import { useTranscriptionSettingsStore } from "@/store/transcriptionSettingsStore";
import "../styles/transcription-modal.css";

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextReady: (text: string) => void;     
  onTextFormatAndSend: (text: string) => void; 
}

export const TranscriptionModal = ({
  isOpen,
  onClose,
  onTextReady,
  onTextFormatAndSend,
}: TranscriptionModalProps) => {
  const { settings } = useTranscriptionSettingsStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setRecognizedText("");

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

      if (!text) throw new Error("Не удалось распознать");

      setRecognizedText(text);
    } catch (error) {
      console.error(error);
      alert("Ошибка транскрибации");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendWithoutFormat = () => {
    if (recognizedText) {
      onTextReady(recognizedText);
      handleClose();
    }
  };

  const handleSendWithFormat = () => {
    if (recognizedText) {
      onTextFormatAndSend(recognizedText);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setRecognizedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="transcription-modal-overlay" onClick={handleClose}>
      <div className="transcription-modal" onClick={(e) => e.stopPropagation()}>
        <div className="transcription-modal-header">
          <h3>Аудио в текст</h3>
          <button className="transcription-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="transcription-modal-body">
          {!recognizedText ? (
            <div className="transcription-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept=".ogg,.mp3,.wav,audio/ogg,audio/mpeg,audio/wav"
                onChange={handleFileSelect}
                className="transcription-file-input"
                id="transcription-file-input"
              />
              <label
                htmlFor="transcription-file-input"
                className="transcription-upload-label"
              >
                <FileAudio size={32} />
                <span>Выберите аудиофайл MP3</span>
              </label>

              {selectedFile && (
                <div className="transcription-file-preview">
                  <div className="transcription-file-info">
                    <FileAudio size={16} />
                    <span>{selectedFile.name}</span>
                    <span className="transcription-file-size">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="transcription-remove-file"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {selectedFile && (
                <button
                  onClick={handleTranscribe}
                  disabled={isProcessing}
                  className="transcription-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Распознавание...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Распознать</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="transcription-result-area">
              <div className="transcription-result-text">
                <p>{recognizedText}</p>
              </div>
              <div className="transcription-result-actions">
                <button
                  onClick={handleSendWithoutFormat}
                  className="transcription-send-btn"
                >
                  <Check size={16} />
                  <span>Отправить в чат (без форматирования)</span>
                </button>
                <button
                  onClick={handleSendWithFormat}
                  className="transcription-format-send-btn"
                >
                  <Sparkles size={16} />
                  <span>Отправить на форматирование</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};