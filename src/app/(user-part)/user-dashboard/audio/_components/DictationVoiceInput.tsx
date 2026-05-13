"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import {
  useDictationSettingsStore,
  LANGUAGES,
} from "@/store/dictationSettingsStore";
import "../styles/dictation-voice-input.css";

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror:
    | ((
        this: SpeechRecognitionInstance,
        ev: SpeechRecognitionErrorEvent,
      ) => void)
    | null;
  onresult:
    | ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void)
    | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface DictationVoiceInputProps {
  onTextReady: (text: string) => void;
  disabled?: boolean;
}

export const DictationVoiceInput = ({
  onTextReady,
  disabled,
}: DictationVoiceInputProps) => {
  const { settings } = useDictationSettingsStore();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const accumulatedFinalTextRef = useRef<string>("");

  const currentLang =
    LANGUAGES.find((l) => l.code === settings.language) || LANGUAGES[0];

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    const SpeechRecognitionAPI =
      (
        window as {
          SpeechRecognition?: SpeechRecognitionConstructor;
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }
      ).SpeechRecognition ||
      (
        window as {
          SpeechRecognition?: SpeechRecognitionConstructor;
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.lang = settings.language;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    accumulatedFinalTextRef.current = "";
    finalTranscriptRef.current = "";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (finalTranscriptRef.current.trim()) {
        onTextReady(finalTranscriptRef.current.trim());
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
        accumulatedFinalTextRef.current +=
          (accumulatedFinalTextRef.current ? " " : "") + finalTranscript;
        finalTranscriptRef.current = accumulatedFinalTextRef.current;
      }

      if (interimTranscript) {
        const currentText = accumulatedFinalTextRef.current
          ? accumulatedFinalTextRef.current + " " + interimTranscript
          : interimTranscript;
        onTextReady(currentText);
      } else if (accumulatedFinalTextRef.current) {
        onTextReady(accumulatedFinalTextRef.current);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech error:", event.error);
      if (event.error === "not-allowed") {
        alert("Доступ к микрофону запрещен");
      }
      stopRecording();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [settings.language, onTextReady, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  if (disabled) return null;

  return (
    <div className="dictation-voice-input">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        className={`dictation-record-btn ${isRecording ? "recording" : ""}`}
        title={isRecording ? "Остановить запись" : "Начать диктовку"}
      >
        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        <span>{isRecording ? "Остановить" : "Диктовка"}</span>
      </button>

      {currentLang.code !== "ru-RU" && (
        <span className="dictation-lang-badge">
          {currentLang.flag} {currentLang.code.split("-")[0]}
        </span>
      )}
    </div>
  );
};
