"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileAudio, Sparkles } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import { useSendMessage } from "../hooks/useAudioSendMessage";
import { formatForScreen } from "../../utils/formatForScreen";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ModeSelector } from "./ModeSelector";
import { MessageList } from "../../_components/MessageList";
import { CyberLoader } from "../../_components/CyberLoader";
import { AudioMode } from "../types";
import {
  GenerationMode,
  FileData,
  GenerationSettings,
  UploadedImage,
} from "../../types";
import { ChatInput } from "./ChatInput";
import { DictationSettingsPanel } from "./DictationSettingsPanel";
import { TranscriptionSettingsPanel } from "./TranscriptionSettingsPanel";
import { TranscriptionModal } from "./TranscriptionModal";
import { useVoiceSettingsStore } from "@/store/voiceSettingsStore";
import { useDictationSettingsStore } from "@/store/dictationSettingsStore";
import { useTranscriptionSettingsStore } from "@/store/transcriptionSettingsStore";
import { DictationVoiceInput } from "./DictationVoiceInput";
import { TextToAudioSettingsPanel } from "./TextToAudioSettingsPanel";
import { useTextToAudioSettingsStore } from "@/store/textToAudioSettingsStore";
import { TextToAudioInstructions } from "./TextToAudioInstructions";
import { AudioLibrary } from "./AudioLibrary";
import { AUDIO_MODES } from "../utils/audioModes";
import { EmptyState } from "../../_components/EmptyState";
import "../../styles/generate-page.css";

const AudioPageContent = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [file, setFile] = useState<FileData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTranscriptionModalOpen, setIsTranscriptionModalOpen] =
    useState(false);
  const [isAudioGenerating, setIsAudioGenerating] = useState(false);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlMode = searchParams.get("mode");
  const chatIdFromUrl = searchParams.get("id");
  const isInitialLoadRef = useRef(true);
  const initialized = useRef(false);
  const skipPanel = useRef(false);
  const skipAutoSpeakRef = useRef(false);
  const prevModeRef = useRef<GenerationMode | null>(null);
  const isLoadingChatRef = useRef(false);

  const voiceStore = useVoiceSettingsStore();
  const dictationStore = useDictationSettingsStore();
  const transcriptionStore = useTranscriptionSettingsStore();
  const textToAudioStore = useTextToAudioSettingsStore();

  const {
    messages,
    setMessages,
    isGenerating,
    setIsGenerating,
    mode,
    setMode,
    showLoader,
    setShowLoader,
    currentMode,
    stopGeneration,
    addUserMessage,
    addStreamingMessage,
    updateStreamingContent,
    finalizeStreamingMessage,
    setErrorMessage,
    clearMessages,
    abortControllerRef,
  } = useChat();

  const {
    currentChatId,
    setCurrentChatId,
    isSidebarOpen,
    setIsSidebarOpen,
    saveChatToDatabase,
    loadChatFromDatabase,
    deleteChat,
    createNewChat,
  } = useChatHistory();

  const { sendMessage } = useSendMessage({
    mode,
    messages,
    isGenerating,
    setShowLoader,
    setIsGenerating,
    addUserMessage,
    addStreamingMessage,
    updateStreamingContent,
    finalizeStreamingMessage,
    setErrorMessage,
    saveChatToDatabase,
    currentChatId,
    abortControllerRef,
  });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const initialMode = AUDIO_MODES.includes(urlMode as GenerationMode)
        ? (urlMode as AudioMode)
        : "dictation";
      setMode(initialMode);

      if (chatIdFromUrl) {
        isLoadingChatRef.current = true;
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as AudioMode);
              const params = new URLSearchParams(searchParams);
              params.set("mode", data.mode);
              router.replace(`${pathname}?${params}`, { scroll: false });
            }
            setCurrentChatId(chatIdFromUrl);
          } else {
            createNewChat();
          }
        } catch (error) {
          console.error("Ошибка загрузки чата:", error);
          createNewChat();
        } finally {
          isLoadingChatRef.current = false;
          isInitialLoadRef.current = false;
        }
      } else {
        createNewChat();
        isInitialLoadRef.current = false;
      }
    };

    init();
  }, [
    chatIdFromUrl,
    createNewChat,
    loadChatFromDatabase,
    pathname,
    router,
    searchParams,
    setCurrentChatId,
    setMessages,
    setMode,
    urlMode,
  ]);

  useEffect(() => {
    if (
      initialized.current &&
      currentChatId &&
      currentChatId !== chatIdFromUrl &&
      !isLoadingChatRef.current
    ) {
      const params = new URLSearchParams(searchParams);
      params.set("id", currentChatId);
      router.replace(`${pathname}?${params}`, { scroll: false });
    }
  }, [currentChatId, chatIdFromUrl, pathname, router, searchParams]);

  useEffect(() => {
    if (!initialized.current) return;
    if (prevModeRef.current === mode) return;
    if (isInitialLoadRef.current) return;

    prevModeRef.current = mode;

    voiceStore.setShowSettings(false);
    dictationStore.setShowSettings(false);
    transcriptionStore.setShowSettings(false);
    textToAudioStore.setShowSettings(false);

    if (!skipPanel.current) {
      switch (mode) {
        case "dictation":
          dictationStore.setShowSettings(true);
          break;
        case "transcription":
          transcriptionStore.setShowSettings(true);
          break;
        case "text_to_audio":
          textToAudioStore.setShowSettings(true);
          break;
        default:
          break;
      }
    }
    skipPanel.current = false;
  }, [dictationStore, mode, textToAudioStore, transcriptionStore, voiceStore]);

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(formatForScreen(content));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (
      messages.length > 0 &&
      !confirm(
        "Чат будет очищен, но история сообщений сохранена. Получить её Вы сможете через <- ЛЕВУЮ боковую панель",
      )
    )
      return;
    if (isGenerating) stopGeneration();
    clearMessages();
    setImages([]);
    setFile(null);
    setCurrentChatId(null);
  };

  const handleNewChat = () => {
    clearChat();
    createNewChat();
    // Удаляем id из URL
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  const retryLastMessage = () => {
    if (isGenerating) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) sendMessage(lastUserMsg.content);
  };

  const handleChatSelect = async (selectedChatId: string) => {
    skipPanel.current = true;
    skipAutoSpeakRef.current = true;
    isLoadingChatRef.current = true;

    const data = await loadChatFromDatabase(selectedChatId);
    if (data) {
      voiceStore.setShowSettings(false);
      dictationStore.setShowSettings(false);
      transcriptionStore.setShowSettings(false);
      textToAudioStore.setShowSettings(false);

      setMessages(data.messages);
      setMode(data.mode as AudioMode);
      setCurrentChatId(selectedChatId);
    }

    isLoadingChatRef.current = false;
    setTimeout(() => {
      skipAutoSpeakRef.current = false;
    }, 1000);
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (await deleteChat(chatIdToDelete, currentChatId)) {
      clearMessages();
      setCurrentChatId(null);
    }
  };

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as AudioMode);
    setInput("");
    skipPanel.current = false;

    // Обновляем URL: удаляем id и устанавливаем новый mode
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    params.delete("id");
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  const generateAudio = async () => {
    if (!input.trim()) return;

    setIsAudioGenerating(true);

    try {
      const response = await fetch("/api/tts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          voice: textToAudioStore.settings.voiceId,
          speed: textToAudioStore.settings.speed,
          language: textToAudioStore.settings.language,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка создания аудио");
      }

      await response.json();

      setLibraryRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Generate audio error:", error);
      alert("Ошибка при создании аудиофайла");
    } finally {
      setIsAudioGenerating(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    if (mode === "text_to_audio") {
      generateAudio();
      return;
    }

    let settingsToSend: GenerationSettings | undefined = undefined;

    if (mode === "dictation") {
      settingsToSend = dictationStore.settings;
    }

    if (mode === "transcription") {
      settingsToSend = transcriptionStore.settings;
    }

    sendMessage(input, images, settingsToSend, file);
    setInput("");
    setImages([]);
    setFile(null);
  };

  const handleDictationReady = (text: string) => {
    setInput(text);
  };

  const handleTranscriptionReady = async (text: string) => {
    const userMessage = addUserMessage(text);
    const allMessages = [...messages, userMessage];
    await saveChatToDatabase(allMessages, mode, currentChatId);

    setInput("");
    setImages([]);
    setFile(null);
    setIsTranscriptionModalOpen(false);
  };

  const handleTranscriptionFormatAndSend = (text: string) => {
    sendMessage(text, images, transcriptionStore.settings, file, true);
    setInput("");
    setImages([]);
    setFile(null);
    setIsTranscriptionModalOpen(false);
  };

  const isDictationMode = mode === "dictation";
  const isTranscriptionMode = mode === "transcription";
  const isTextToAudioMode = mode === "text_to_audio";

  const renderSettingsPanel = () => {
    if (isDictationMode) return <DictationSettingsPanel />;
    if (isTranscriptionMode) return <TranscriptionSettingsPanel />;
    if (isTextToAudioMode) return <TextToAudioSettingsPanel />;
    return null;
  };

  if (isLoadingChatRef.current && chatIdFromUrl) {
    return (
      <div className="dashboard-loading-state">
        <CyberLoader />
        <span>Загрузка диалога...</span>
      </div>
    );
  }

  return (
    <>
      <div className="generate-page">
        <Link href="/user-dashboard" className="generate-section-link">
          <ChevronLeft className="w-4 h-4" />К панели управления
        </Link>

        <ChatSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentChatId={currentChatId}
          onSelectChat={handleChatSelect}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />

        <div className="chat-container">
          <ChatHeader
            onNewChat={clearChat}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          <div className="mode-selector-wrapper">
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
          </div>

          {(isDictationMode || isTranscriptionMode || isTextToAudioMode) && (
            <div className="header-actions">{renderSettingsPanel()}</div>
          )}

          <div className="chat-content">
            <div className="messages-area" ref={messagesContainerRef}>
              {messages.length === 0 ? (
                <EmptyState
                  modeLabel={currentMode.label}
                  modeDescription={currentMode.description}
                />
              ) : (
                <MessageList
                  messages={messages}
                  copiedId={copiedId}
                  onCopy={copyMessage}
                  onRetry={!isGenerating ? retryLastMessage : undefined}
                  mode={mode}
                />
              )}
            </div>
            <CyberLoader isVisible={showLoader} />
            {isTranscriptionMode && !isGenerating && (
              <button
                onClick={() => setIsTranscriptionModalOpen(true)}
                className="transcription-open-btn"
                title="Аудио в текст"
              >
                <FileAudio size={18} />
                <span>Аудио в текст</span>
              </button>
            )}
            {isTextToAudioMode && (
              <>
                <div className="text-to-audio-modal">
                  <TextToAudioInstructions />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Введите текст для преобразования в аудио..."
                  rows={10}
                  className="text-to-audio-textarea"
                />
                <div className="text-to-audio-button-wrapper">
                  <button
                    onClick={generateAudio}
                    disabled={isAudioGenerating || !input.trim()}
                    className="text-to-audio-send-btn"
                  >
                    <Sparkles size={18} />
                    <span>
                      {isAudioGenerating ? "Создание..." : "Создать аудио"}
                    </span>
                  </button>
                </div>

                <AudioLibrary key={libraryRefreshKey} />
              </>
            )}
          </div>
        </div>
        {isDictationMode && (
          <DictationVoiceInput
            onTextReady={handleDictationReady}
            disabled={isGenerating}
          />
        )}
      </div>
      {!isDictationMode ||
        (!isTextToAudioMode && (
          <ChatInput
            input={input}
            setInput={setInput}
            images={images}
            onImagesChange={setImages}
            file={file}
            onFileChange={setFile}
            isGenerating={isGenerating}
            onSend={handleSendMessage}
            onStop={stopGeneration}
            placeholder={currentMode.placeholder}
            disabled={isGenerating}
            onNewChat={handleNewChat}
            messages={messages}
          />
        ))}

      {isTranscriptionMode && (
        <TranscriptionModal
          isOpen={isTranscriptionModalOpen}
          onClose={() => setIsTranscriptionModalOpen(false)}
          onTextReady={handleTranscriptionReady}
          onTextFormatAndSend={handleTranscriptionFormatAndSend}
        />
      )}
    </>
  );
};

export default AudioPageContent;
