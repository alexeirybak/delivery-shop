import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import type {
  VoiceInputProps,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "../education/types/speech-recognition";
import "../styles/voice-input.css";

export const VoiceInput = ({
  onTranscript,
  onInterimTranscript,
  disabled = false,
}: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef<string>("");

  const requestMicrophone =
    useCallback(async (): Promise<MediaStream | null> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        return stream;
      } catch {
        alert("Не удалось получить доступ к микрофону");
        return null;
      }
    }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    const stream = await requestMicrophone();
    if (!stream) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = true;
      recognition.lang = "ru-RU";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let accumulatedFinalText = "";

      recognition.onstart = () => {
        setIsRecording(true);
        finalTranscriptRef.current = "";
        accumulatedFinalText = "";
      };

      recognition.onend = () => {
        setIsRecording(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (finalTranscriptRef.current.trim()) {
          onTranscript(finalTranscriptRef.current.trim());
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          accumulatedFinalText +=
            (accumulatedFinalText ? " " : "") + finalTranscript;
          finalTranscriptRef.current = accumulatedFinalText;
        }

        if (interimTranscript) {
          const currentText = accumulatedFinalText
            ? accumulatedFinalText + " " + interimTranscript
            : interimTranscript;

          if (onInterimTranscript) {
            onInterimTranscript(currentText);
          } else {
            onTranscript(currentText);
          }
        } else if (accumulatedFinalText) {
          if (onInterimTranscript) {
            onInterimTranscript(accumulatedFinalText);
          } else {
            onTranscript(accumulatedFinalText);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "not-allowed") {
          alert("Доступ к микрофону запрещен");
          stopRecording();
        } else if (event.error === "audio-capture") {
          alert("Ошибка захвата аудио");
          stopRecording();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      alert("Не удалось запустить распознавание речи");
    }
  }, [onTranscript, onInterimTranscript, requestMicrophone, stopRecording]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (disabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className="voice-input-btn"
      title={isRecording ? "Остановить запись" : "Голосовой ввод"}
    >
      {isRecording ? (
        <MicOff size={20} style={{ width: 20, height: 20, flexShrink: 0 }} />
      ) : (
        <Mic size={20} style={{ width: 20, height: 20, flexShrink: 0 }} />
      )}
    </button>
  );
};
