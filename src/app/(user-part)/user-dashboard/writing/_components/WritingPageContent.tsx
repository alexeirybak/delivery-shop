"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useSendMessage } from "../hooks/useWritingSendMessage";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "../../_components/MessageList";
import { EmptyState } from "../../_components/EmptyState";
import { ChatInput } from "./ChatInput";
import { useWritingSettingsStore } from "@/store/writingSettingsStore";
import { WritingSettingsPanel } from "./WritingSettingsPanel";
import { TestSettingsPanel } from "./TestSettingsPanel";
import { GenerationMode, Message } from "../../types";
import { CyberLoader } from "../../_components/CyberLoader";
import { formatForScreen } from "../../utils/formatForScreen";
import { useChatHistory } from "../hooks/useChatHistory";
import { GenerationProgress } from "./GenerationProgress";
import { DownloadPanelContent } from "./DownloadPanelContent";
import { ModeSelector } from "./ModeSelector";
import { useTestSettingsStore } from "@/store/testSettingsStore";
import "./../../styles/generate-page.css";
import "../styles/writing-settings.css";
import { WritingMode } from "../types";

const WritingPageContent = () => {
  const [input, setInput] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [isCompletedMessageVisible, setIsCompletedMessageVisible] =
    useState(true);
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    currentSection: string;
  } | null>(null);
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

  const testStore = useTestSettingsStore();
  const writingStore = useWritingSettingsStore();

  const {
    settings: writingSettings,
    isGenerationCompleted: isStoreGenerationCompleted,
    setGenerationCompleted,
    resetGenerationCompleted,
  } = useWritingSettingsStore();

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

  const isValidMode = (
    modeValue: string | null,
  ): modeValue is GenerationMode => {
    const validModes: GenerationMode[] = [
      "textbooks",
      "essay",
      "test",
      "coursework",
      "report",
      "thesis",
    ];
    return (
      modeValue !== null && validModes.includes(modeValue as GenerationMode)
    );
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const initialMode = isValidMode(urlMode)
        ? (urlMode as WritingMode)
        : "textbooks";
      setMode(initialMode);

      if (chatIdFromUrl) {
        setIsLoadingChat(true);
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as WritingMode);
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
    if (!initialized.current) return;
    if (prevModeRef.current === mode) return;
    if (isInitialLoadRef.current) return;

    prevModeRef.current = mode;

    writingStore.setShowSettings(false);
    testStore.setShowSettings(false);

    if (!skipPanel.current) {
      switch (mode) {
        case "textbooks":
        case "coursework":
        case "report":
        case "thesis":
          writingStore.setShowSettings(true);
          break;
        case "test":
          testStore.setShowSettings(true);
          break;
        default:
          break;
      }
    }
    skipPanel.current = false;
  }, [mode, writingStore, testStore]);

  const copyMessage = useCallback(
    async (content: string, id: string): Promise<void> => {
      const screenText = formatForScreen(content);
      await navigator.clipboard.writeText(screenText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [],
  );

  const clearChat = useCallback((): void => {
    if (
      messages.length > 0 &&
      !confirm(
        "Чат будет очищен, но история сообщений сохранена. Получить её Вы сможете через <- ЛЕВУЮ боковую панель",
      )
    )
      return;
    if (isGenerating) stopGeneration();
    clearMessages();
    setCurrentChatId(null);
  }, [
    messages.length,
    isGenerating,
    stopGeneration,
    clearMessages,
    setCurrentChatId,
  ]);

  const handleNewChat = useCallback((): void => {
    clearChat();
    createNewChat();
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    if (params.has("id")) {
      params.delete("id");
    }
    router.replace(`${pathname}?${params}`, { scroll: false });
  }, [clearChat, createNewChat, mode, pathname, router, searchParams]);

  const handleChatSelect = useCallback(
    async (selectedChatId: string): Promise<void> => {
      skipPanel.current = true;
      setIsLoadingChat(true);
      const data = await loadChatFromDatabase(selectedChatId);
      if (data) {
        setMessages(data.messages);
        setMode(data.mode as WritingMode);
        setCurrentChatId(selectedChatId);
        updateUrl(data.mode, selectedChatId);
      }
      setIsLoadingChat(false);
    },
    [loadChatFromDatabase, setMessages, setMode, setCurrentChatId, updateUrl],
  );

  const handleDeleteChat = useCallback(
    async (chatIdToDelete: string): Promise<void> => {
      const shouldClear = await deleteChat(chatIdToDelete, currentChatId);
      if (shouldClear) {
        clearMessages();
        setCurrentChatId(null);
        updateUrl(mode, null);
      }
    },
    [
      deleteChat,
      currentChatId,
      clearMessages,
      setCurrentChatId,
      mode,
      updateUrl,
    ],
  );

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as WritingMode);
    setInput("");
    skipPanel.current = false;
    updateUrl(newMode, null);
  };

  const getAllTestChaptersToGenerate = useCallback(() => {
    return testStore.settings.chapters;
  }, [testStore.settings.chapters]);

  const getAllChaptersToGenerate = useCallback(() => {
    return writingSettings.chapters;
  }, [writingSettings.chapters]);

  const handleStopGeneration = useCallback(() => {
    stopGeneration();
    setStopRequested(true);
  }, [stopGeneration]);

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (mode === "essay") {
      const finalPrompt = input || writingSettings.title || "";
      if (!finalPrompt.trim()) return;
      await sendMessage(finalPrompt, writingSettings, currentChatId);
      setInput("");
      return;
    }

    if (mode === "test") {
      const chapters = getAllTestChaptersToGenerate();

      if (chapters.length === 0) {
        const finalPrompt = input || testStore.settings.title || "";
        if (!finalPrompt.trim()) return;
        await sendMessage(finalPrompt, testStore.settings, currentChatId);
        setInput("");
        return;
      }

      setIsGeneratingAll(true);
      setStopRequested(false);
      setGenerationProgress({
        current: 0,
        total: chapters.length,
        currentSection: "",
      });

      const userMessageContent = `Контрольная работа${testStore.settings.subject ? ` по "${testStore.settings.subject}"` : ""}${testStore.settings.title ? ` на тему "${testStore.settings.title}"` : ""}`;

      const userMessageObj: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessageContent,
        timestamp: new Date(),
        isStreaming: false,
        mode,
      };

      let savedChatId: string | null = currentChatId;

      if (savedChatId === null) {
        savedChatId = await saveChatToDatabase(
          [userMessageObj],
          mode,
          savedChatId,
        );
      }

      let generatedContent = "";

      resetGenerationCompleted();

      for (let i = 0; i < chapters.length; i++) {
        if (stopRequested) break;

        const chapter = chapters[i];

        setGenerationProgress({
          current: i + 1,
          total: chapters.length,
          currentSection: chapter.title,
        });

        let prompt = "";

        if (chapter.sections.length === 0) {
          prompt = `Сгенерируй раздел "${chapter.title}" для контрольной работы${testStore.settings.subject ? ` по предмету "${testStore.settings.subject}"` : ""}${testStore.settings.title ? ` на тему "${testStore.settings.title}"` : ""}.`;
        } else {
          const questionsList = chapter.sections
            .map((s, idx) => `${idx + 1}. ${s.title}`)
            .join("\n");

          prompt = `Сгенерируй раздел "${chapter.title}" для контрольной работы${testStore.settings.subject ? ` по предмету "${testStore.settings.subject}"` : ""}${testStore.settings.title ? ` на тему "${testStore.settings.title}"` : ""}.

          Выполни следующие задания:
          ${questionsList}

          Оформи каждое задание отдельно, с четкими формулировками.`;
        }

        const result = await sendMessage(
          prompt,
          testStore.settings,
          savedChatId,
          true,
          false,
        );

        if (savedChatId === null && result.chatId) {
          savedChatId = result.chatId;
        }

        generatedContent += `\n\n## ${chapter.title}\n\n${result.content}\n\n`;

        if (i < chapters.length - 1 && !stopRequested) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (!stopRequested && generatedContent) {
        const newMessages: Message[] = [
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: generatedContent,
            timestamp: new Date(),
            isStreaming: false,
            mode,
          },
        ];

        await saveChatToDatabase(newMessages, mode, savedChatId);
        setGenerationCompleted(true);
      }
      setIsGeneratingAll(false);
      setGenerationProgress(null);
      setStopRequested(false);
      setInput("");
      return;
    }

    if (
      mode === "textbooks" ||
      mode === "coursework" ||
      mode === "report" ||
      mode === "thesis"
    ) {
      const chapters = getAllChaptersToGenerate();

      if (chapters.length === 0) {
        const finalPrompt = input || writingSettings.title || "";
        if (!finalPrompt.trim()) return;
        await sendMessage(finalPrompt, writingSettings, currentChatId);
        setInput("");
        return;
      }

      setIsGeneratingAll(true);
      setStopRequested(false);
      setGenerationProgress({
        current: 0,
        total: chapters.length,
        currentSection: "",
      });

      const userMessageContent =
        `${writingSettings.subject ? ` по "${writingSettings.subject}"` : ""}${writingSettings.title ? ` на тему "${writingSettings.title}"` : ""}`.trim();

      const userMessageObj: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessageContent,
        timestamp: new Date(),
        isStreaming: false,
        mode,
      };

      let savedChatId: string | null = currentChatId;

      if (savedChatId === null) {
        savedChatId = await saveChatToDatabase(
          [userMessageObj],
          mode,
          savedChatId,
        );
      }

      let generatedContent = "";

      resetGenerationCompleted();

      for (let i = 0; i < chapters.length; i++) {
        if (stopRequested) break;

        const chapter = chapters[i];

        setGenerationProgress({
          current: i + 1,
          total: chapters.length,
          currentSection: chapter.title,
        });

        const workType =
          mode === "textbooks"
            ? "учебника"
            : mode === "coursework"
              ? "курсовой работы"
              : mode === "report"
                ? "реферата"
                : "ВКР";
        const chapterNumber = i + 1;

        let prompt = "";

        if (chapter.title.toLowerCase() === "введение") {
          prompt = `Сгенерируй ВВЕДЕНИЕ для ${workType} на тему "${writingSettings.title}" по предмету "${writingSettings.subject}".`;
        } else if (chapter.title.toLowerCase() === "заключение") {
          prompt = `Сгенерируй ЗАКЛЮЧЕНИЕ для ${workType} на тему "${writingSettings.title}" по предмету "${writingSettings.subject}".`;
        } else {
          if (chapter.sections.length === 0) {
            prompt = `Сгенерируй ГЛАВУ ${chapterNumber}: "${chapter.title}" для ${workType} на тему "${writingSettings.title}" по предмету "${writingSettings.subject}".`;
          } else {
            const sectionsList = chapter.sections
              .map((s, idx) => `${chapterNumber}.${idx + 1}. ${s.title}`)
              .join("\n");

            prompt = `Сгенерируй ГЛАВУ ${chapterNumber}: "${chapter.title}" для ${workType} на тему "${writingSettings.title}" по предмету "${writingSettings.subject}".

Включи следующие параграфы:
${sectionsList}`;
          }
        }

        const result = await sendMessage(
          prompt,
          writingSettings,
          savedChatId,
          true,
          false,
        );

        if (savedChatId === null && result.chatId) {
          savedChatId = result.chatId;
        }

        generatedContent += `\n\n## ${chapter.title}\n\n${result.content}\n\n`;
      }

      if (!stopRequested && generatedContent) {
        const finalStreamingId = addStreamingMessage();
        finalizeStreamingMessage(finalStreamingId, generatedContent);

        const newMessages: Message[] = [
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: generatedContent,
            timestamp: new Date(),
            isStreaming: false,
            mode,
          },
        ];

        await saveChatToDatabase(newMessages, mode, savedChatId);
        setGenerationCompleted(true);
      }

      setIsGeneratingAll(false);
      setGenerationProgress(null);
      setStopRequested(false);
      setInput("");
      return;
    }
  }, [
    mode,
    input,
    getAllTestChaptersToGenerate,
    getAllChaptersToGenerate,
    sendMessage,
    writingSettings,
    testStore,
    stopRequested,
    resetGenerationCompleted,
    setGenerationCompleted,
    addStreamingMessage,
    finalizeStreamingMessage,
    saveChatToDatabase,
    currentChatId,
  ]);

  const renderSettingsPanel = () => {
    switch (mode) {
      case "textbooks":
      case "coursework":
      case "report":
      case "thesis":
        return <WritingSettingsPanel mode={mode} onSend={handleSendMessage} />;
      case "test":
        return <TestSettingsPanel onSend={handleSendMessage} />;
      default:
        return null;
    }
  };

  const showSettingsPanel = mode !== "essay";

  if (isLoadingChat && chatIdFromUrl && isInitialLoadRef.current) {
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
                  onRetry={undefined}
                />
              )}
            </div>
            <CyberLoader isVisible={showLoader} />

            {isStoreGenerationCompleted &&
              isCompletedMessageVisible &&
              messages.length > 0 && (
                <div className="article-complete-prompt">
                  <div className="article-complete-prompt-header">
                    <p>Генерация завершена! Вы можете скачать результат</p>
                    <button
                      className="article-complete-close-btn"
                      onClick={() => setIsCompletedMessageVisible(false)}
                      aria-label="Скрыть сообщение"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <DownloadPanelContent messages={messages} />
                </div>
              )}
          </div>
        </div>
      </div>
      {isGeneratingAll && generationProgress && (
        <GenerationProgress
          current={generationProgress.current}
          total={generationProgress.total}
          currentSection={generationProgress.currentSection}
        />
      )}
      <ChatInput
        input={input}
        setInput={setInput}
        isGenerating={isGenerating}
        onSend={handleSendMessage}
        onStop={handleStopGeneration}
        placeholder={currentMode.placeholder}
        disabled={isGenerating}
        onNewChat={handleNewChat}
        messages={messages}
      />
    </>
  );
};

export default WritingPageContent;
