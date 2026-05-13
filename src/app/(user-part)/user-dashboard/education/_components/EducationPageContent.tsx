"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import { useSendMessage } from "../hooks/useEducationSendMessage";
import { formatForScreen } from "../../utils/formatForScreen";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ModeSelector } from "./ModeSelector";
import { MessageList } from "../../_components/MessageList";
import { CyberLoader } from "../../_components/CyberLoader";
import { EducationMode } from "../types";
import { SyllabusSettingsPanel } from "./SyllabusSettingsPanel";
import { QuizSettingsPanel } from "./QuizSettingsPanel";
import { LectureSettingsPanel } from "./LectureSettingsPanel";
import { HomeworkSettingsPanel } from "./HomeworkSettingsPanel";
import { PracticalSettingsPanel } from "./PracticalSettingsPanel";
import { LaboratorySettingsPanel } from "./LaboratorySettingsPanel";
import { InteractiveSettingsPanel } from "./InteractiveSettingsPanel";
import { ProjectSettingsPanel } from "./ProjectSettingsPanel";
import { ExamsSettingsPanel } from "./ExamsSettingsPanel";
import { CreditSettingsPanel } from "./CreditSettingsPanel";
import { ComparisonSettingsPanel } from "./ComparisonSettingsPanel";
import { DebateSettingsPanel } from "./DebateSettingsPanel";
import { useSyllabusSettingsStore } from "@/store/syllabusSettingsStore";
import { useQuizSettingsStore } from "@/store/quizSettingsStore";
import { useLectureSettingsStore } from "@/store/lectureSettingsStore";
import { useHomeworkSettingsStore } from "@/store/homeworkSettingsStore";
import { usePracticalSettingsStore } from "@/store/practicalSettingsStore";
import { useLaboratorySettingsStore } from "@/store/laboratorySettingsStore";
import { useInteractiveSettingsStore } from "@/store/interactiveSettingsStore";
import { useProjectSettingsStore } from "@/store/projectSettingsStore";
import { useCreditSettingsStore } from "@/store/creditSettingsStore";
import { useExamsSettingsStore } from "@/store/examsSettingsStore";
import { useComparisonSettingsStore } from "@/store/comparisonSettingsStore";
import { useDebateSettingsStore } from "@/store/debateSettingsStore";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FileData, GenerationMode, UploadedImage } from "../../types";
import { ChatInput } from "./ChatInput";
import { EDUCATION_MODES } from "../utils/educationModes";
import { EmptyState } from "../../_components/EmptyState";
import "../../styles/generate-page.css";

const EducationPageContent = () => {
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
  const syllabusStore = useSyllabusSettingsStore();
  const quizStore = useQuizSettingsStore();
  const lectureStore = useLectureSettingsStore();
  const homeworkStore = useHomeworkSettingsStore();
  const practicalStore = usePracticalSettingsStore();
  const laboratoryStore = useLaboratorySettingsStore();
  const interactiveStore = useInteractiveSettingsStore();
  const projectStore = useProjectSettingsStore();
  const creditStore = useCreditSettingsStore();
  const examsStore = useExamsSettingsStore();
  const comparisonStore = useComparisonSettingsStore();
  const debateStore = useDebateSettingsStore();

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
      const initialMode = EDUCATION_MODES.includes(urlMode as GenerationMode)
        ? (urlMode as EducationMode)
        : "chat_education";

      setMode(initialMode);

      if (chatIdFromUrl) {
        setIsLoadingChat(true);
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as EducationMode);
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
    if (mode === "chat_education") return;

    syllabusStore.setShowSettings(false);
    quizStore.setShowSettings(false);
    lectureStore.setShowSettings(false);
    homeworkStore.setShowSettings(false);
    practicalStore.setShowSettings(false);
    laboratoryStore.setShowSettings(false);
    interactiveStore.setShowSettings(false);
    projectStore.setShowSettings(false);
    creditStore.setShowSettings(false);
    examsStore.setShowSettings(false);
    comparisonStore.setShowSettings(false);
    debateStore.setShowSettings(false);

    if (!skipPanel.current) {
      switch (mode) {
        case "syllabus":
          syllabusStore.setShowSettings(true);
          break;
        case "quiz":
          quizStore.setShowSettings(true);
          break;
        case "lecture":
          lectureStore.setShowSettings(true);
          break;
        case "homework_check":
          homeworkStore.setShowSettings(true);
          break;
        case "practice":
          practicalStore.setShowSettings(true);
          break;
        case "laboratory":
          laboratoryStore.setShowSettings(true);
          break;
        case "interactive":
          interactiveStore.setShowSettings(true);
          break;
        case "project":
          projectStore.setShowSettings(true);
          break;
        case "credit":
          creditStore.setShowSettings(true);
          break;
        case "exams":
          examsStore.setShowSettings(true);
          break;
        case "comparison":
          comparisonStore.setShowSettings(true);
          break;
        case "debate":
          debateStore.setShowSettings(true);
          break;
        default:
          break;
      }
    }
    skipPanel.current = false;
  }, [
    mode,
    syllabusStore,
    quizStore,
    lectureStore,
    homeworkStore,
    practicalStore,
    laboratoryStore,
    interactiveStore,
    projectStore,
    creditStore,
    examsStore,
    comparisonStore,
    debateStore,
  ]);

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
      syllabusStore.setShowSettings(false);
      quizStore.setShowSettings(false);
      lectureStore.setShowSettings(false);
      homeworkStore.setShowSettings(false);
      practicalStore.setShowSettings(false);
      laboratoryStore.setShowSettings(false);
      interactiveStore.setShowSettings(false);
      projectStore.setShowSettings(false);
      creditStore.setShowSettings(false);
      examsStore.setShowSettings(false);
      comparisonStore.setShowSettings(false);
      debateStore.setShowSettings(false);

      setMessages(data.messages);
      setMode(data.mode as EducationMode);
      setCurrentChatId(selectedChatId);
      updateUrl(data.mode, selectedChatId);
    }
    setIsLoadingChat(false);
  };

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as EducationMode);
    setInput("");
    skipPanel.current = false;
    updateUrl(newMode, null);
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (await deleteChat(chatIdToDelete, currentChatId)) {
      clearMessages();
      setCurrentChatId(null);
      updateUrl(mode, null);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() && images.length === 0 && !file) return;

    const modesWithSettings = [
      "syllabus",
      "quiz",
      "lecture",
      "homework_check",
      "practice",
      "laboratory",
      "interactive",
      "project",
      "credit",
      "exams",
      "comparison",
      "debate",
    ] as const;

    type ModeWithSettings = (typeof modesWithSettings)[number];

    const settingsMap = {
      syllabus: syllabusStore.settings,
      quiz: quizStore.settings,
      lecture: lectureStore.settings,
      homework_check: homeworkStore.settings,
      practice: practicalStore.settings,
      laboratory: laboratoryStore.settings,
      interactive: interactiveStore.settings,
      project: projectStore.settings,
      credit: creditStore.settings,
      exams: examsStore.settings,
      comparison: comparisonStore.settings,
      debate: debateStore.settings,
    } as const;

    let currentSettings = undefined;

    if (modesWithSettings.includes(mode as ModeWithSettings)) {
      currentSettings = settingsMap[mode as ModeWithSettings];
    }

    sendMessage(input, images, currentSettings, file);

    setInput("");
    setImages([]);
    setFile(null);
  };

  const renderSettingsPanel = () => {
    switch (mode) {
      case "syllabus":
        return <SyllabusSettingsPanel />;
      case "quiz":
        return <QuizSettingsPanel />;
      case "lecture":
        return <LectureSettingsPanel />;
      case "homework_check":
        return <HomeworkSettingsPanel />;
      case "practice":
        return <PracticalSettingsPanel />;
      case "laboratory":
        return <LaboratorySettingsPanel />;
      case "interactive":
        return <InteractiveSettingsPanel />;
      case "project":
        return <ProjectSettingsPanel />;
      case "credit":
        return <CreditSettingsPanel />;
      case "exams":
        return <ExamsSettingsPanel />;
      case "comparison":
        return <ComparisonSettingsPanel />;
      case "debate":
        return <DebateSettingsPanel />;
      default:
        return null;
    }
  };

  const showSettingsPanel = mode !== "chat_education";

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

          {showSettingsPanel && (
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
                  onRetry={
                    messages.length > 0 && !isGenerating
                      ? retryLastMessage
                      : undefined
                  }
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

export default EducationPageContent;
