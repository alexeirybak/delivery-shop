"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import { useSendMessage } from "../hooks/useLearningSendMessage";
import { formatForScreen } from "../../utils/formatForScreen";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ModeSelector } from "./ModeSelector";
import { MessageList } from "../../_components/MessageList";
import { EmptyState } from "../../_components/WorkbookEmptyState";
import { CyberLoader } from "../../_components/CyberLoader";
import { ChatInput } from "./ChatInput";
import { VoiceSettingsPanel } from "./VoiceSettingsPanel";
import { useVoiceSettingsStore } from "@/store/voiceSettingsStore";
import { LEARNING_MODES } from "../utils/learningModes";
import { useSolutionSettingsStore } from "@/store/solutionSettingsStore";
import { SolutionSettingsPanel } from "./SolutionSettingsPanel";
import { useCheatsheetsSettingsStore } from "@/store/cheatsheetsSettingsStore";
import { CheatsheetsSettingsPanel } from "./CheatsheetsSettingsPanel";
import { LearningMode } from "../types";
import {
  GenerationMode,
  FileData,
  GenerationSettings,
  UploadedImage,
} from "../../types";
import "../../styles/generate-page.css";
import "../styles/download-notice.css";

const LearningPageContent = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [file, setFile] = useState<FileData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlMode = searchParams.get("mode");
  const chatIdFromUrl = searchParams.get("id");
  const initialized = useRef(false);
  const skipPanel = useRef(false);
  const prevModeRef = useRef<GenerationMode | null>(null);
  const isInitialLoadRef = useRef(true);
  const voiceStore = useVoiceSettingsStore();
  const solutionStore = useSolutionSettingsStore();
  const cheatsheetsStore = useCheatsheetsSettingsStore();

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

  const updateUrl = useCallback(
    (newMode: GenerationMode, newChatId?: string | null) => {
      const params = new URLSearchParams(searchParams);
      params.set("mode", newMode);
      if (newChatId) {
        params.set("id", newChatId);
      } else if (chatIdFromUrl) {
        params.delete("id");
      }
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [chatIdFromUrl, pathname, router, searchParams],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const initialMode = LEARNING_MODES.includes(urlMode as GenerationMode)
        ? (urlMode as LearningMode)
        : "chat_learning";

      setMode(initialMode);

      if (chatIdFromUrl) {
        setIsLoadingChat(true);
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as LearningMode);
              updateUrl(data.mode, chatIdFromUrl);
            }
            setCurrentChatId(chatIdFromUrl);
          } else {
            createNewChat();
          }
        } catch (error) {
          console.error("Ошибка загрузки чата:", error);
          createNewChat();
        } finally {
          setIsLoadingChat(false);
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
    setCurrentChatId,
    setMessages,
    setMode,
    updateUrl,
    urlMode,
  ]);

  useEffect(() => {
    if (
      initialized.current &&
      currentChatId &&
      currentChatId !== chatIdFromUrl &&
      !isLoadingChat &&
      !isInitialLoadRef.current
    ) {
      updateUrl(mode, currentChatId);
    }
  }, [currentChatId, chatIdFromUrl, mode, isLoadingChat, updateUrl]);

  useEffect(() => {
    if (!initialized.current) return;
    if (prevModeRef.current === mode) return;

    if (isInitialLoadRef.current) return;

    prevModeRef.current = mode;
    if (mode === "chat_learning") return;

    voiceStore.setShowSettings(false);
    solutionStore.setShowSettings(false);
    cheatsheetsStore.setShowSettings(false);

    if (!skipPanel.current) {
      switch (mode) {
        case "psychological_support":
          voiceStore.setShowSettings(true);
          break;
        case "solution_book":
          solutionStore.setShowSettings(true);
          break;
        case "cheatsheets":
          cheatsheetsStore.setShowSettings(true);
          break;
        default:
          break;
      }
    }
    skipPanel.current = false;
  }, [mode, solutionStore, voiceStore, cheatsheetsStore]);

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
    updateUrl(mode, null);
  };

  const retryLastMessage = () => {
    if (isGenerating) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg)
      if (lastUserMsg) {
        sendMessage(lastUserMsg.content, undefined, undefined, undefined, true);
      }
  };

  const handleChatSelect = async (selectedChatId: string) => {
    skipPanel.current = true;
    setIsLoadingChat(true);
    const data = await loadChatFromDatabase(selectedChatId);
    if (data) {
      voiceStore.setShowSettings(false);
      solutionStore.setShowSettings(false);
      cheatsheetsStore.setShowSettings(false);

      setMessages(data.messages);
      setMode(data.mode as LearningMode);
      setCurrentChatId(selectedChatId);
      updateUrl(data.mode, selectedChatId);
    }
    setIsLoadingChat(false);
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (await deleteChat(chatIdToDelete, currentChatId)) {
      clearMessages();
      setCurrentChatId(null);
      updateUrl(mode, null);
    }
  };

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as LearningMode);
    setInput("");
    skipPanel.current = false;
    updateUrl(newMode, null);
  };

  const handleSendMessage = () => {
    if (!input.trim() && !images.length && !file) return;

    let settingsToSend: GenerationSettings | undefined = undefined;

    if (mode === "psychological_support") {
      settingsToSend = voiceStore.settings;
    }

    if (mode === "solution_book") {
      settingsToSend = solutionStore.settings;
    }

    if (mode === "cheatsheets") {
      settingsToSend = cheatsheetsStore.settings;
    }

    sendMessage(input, images, settingsToSend, file);
    setInput("");
    setImages([]);
    setFile(null);
  };

  const isPsychologicalMode = mode === "psychological_support";
  const isSolutionMode = mode === "solution_book";
  const isCheatsheetsMode = mode === "cheatsheets";

  const renderSettingsPanel = () => {
    if (isPsychologicalMode) return <VoiceSettingsPanel />;
    if (isSolutionMode) return <SolutionSettingsPanel />;
    if (isCheatsheetsMode) return <CheatsheetsSettingsPanel />;
    return null;
  };

  if (isLoadingChat && chatIdFromUrl) {
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

          {(isPsychologicalMode || isSolutionMode || isCheatsheetsMode) && (
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
          </div>
        </div>
      </div>

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
    </>
  );
};

export default LearningPageContent;
