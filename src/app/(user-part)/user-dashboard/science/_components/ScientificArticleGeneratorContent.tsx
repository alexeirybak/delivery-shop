"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import {
  useSendMessage,
  SendMessageOptions,
} from "../hooks/useScienceSendMessage";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "../../_components/MessageList";
import { CyberLoader } from "../../_components/CyberLoader";
import { useScientificArticleSettingsStore } from "@/store/scientificArticleSettingsStore";
import { useArticleStatusStore } from "@/store/articleStatusStore";
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  AlertCircle,
  Edit,
  RefreshCw,
  X,
} from "lucide-react";
import { DownloadPanelContent } from "./DownloadPanelContent";
import { PlanEditor } from "./PlanEditor";
import { cleanPlanForEditing } from "../utils/cleanPlanForEditing";
import { useModelSelection } from "../hooks/useModelSelection";
import { ModeSelector } from "./ModeSelector";
import { ScienceMode } from "../types";
import { GenerationMode } from "../../types";
import { ChatInput } from "./ChatInput";
import { ScientificArticleSettingsPanel } from "./ScientificArticleSettingsPanel";
import { ARTICLE_MODES } from "../utils/articlesModes";
import { EmptyState } from "../../_components/EmptyState";
import "../../styles/generate-page.css";

const ALL_MODES = ["chat_science", ...ARTICLE_MODES];

const ScientificArticleGeneratorContent = () => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editingPlanContent, setEditingPlanContent] = useState("");
  const [isCompletedMessageVisible, setIsCompletedMessageVisible] =
    useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const { model, setModel } = useModelSelection();
  const articleStore = useScientificArticleSettingsStore();
  const { status: articleStatus, setStatus } = useArticleStatusStore();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlMode = searchParams.get("mode");
  const chatIdFromUrl = searchParams.get("id");

  const initialized = useRef(false);
  const skipPanel = useRef(false);
  const prevModeRef = useRef<GenerationMode | null>(null);
  const isInitialLoadRef = useRef(true);

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

  const isArticleMode = ARTICLE_MODES.includes(mode as string);

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
      const initialMode =
        ALL_MODES.includes(urlMode as string) && urlMode
          ? (urlMode as ScienceMode)
          : "chat_science";

      setMode(initialMode);

      if (chatIdFromUrl) {
        setIsLoadingChat(true);
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as ScienceMode);
              updateUrl(data.mode, chatIdFromUrl);
            }
            if (data.articleStatus) {
              setStatus(data.articleStatus);
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
    setStatus,
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

    if (!isArticleMode) return;

    if (!skipPanel.current) {
      articleStore.setShowSettings(true);
    }
    skipPanel.current = false;
  }, [mode, isArticleMode, articleStore]);

  const copyMessage = async (content: string, id: string) => {
    const screenText = content;
    await navigator.clipboard.writeText(screenText);
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
    setCurrentChatId(null);
    setStatus("idle");
    articleStore.setShowSettings(true);
  };

  const handleNewArticle = () => {
    clearChat();
    createNewChat();
    updateUrl(mode, null);
  };

  const retryLastMessage = () => {
    if (isGenerating) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    if (!isArticleMode) {
      const options: SendMessageOptions = {
        customInput: lastUserMsg.content,
        mode,
        model,
      };
      sendMessage(options);
      return;
    }

    const options: SendMessageOptions = {
      customInput: lastUserMsg.content,
      metaType: "article_part",
      mode,
      settings: articleStore.settings,
      model,
    };
    sendMessage(options);
  };

  const handleChatSelect = async (selectedChatId: string) => {
    skipPanel.current = true;
    setIsLoadingChat(true);
    const data = await loadChatFromDatabase(selectedChatId);
    if (data) {
      if (isArticleMode) {
        articleStore.setShowSettings(false);
      }
      setMessages(data.messages);
      setMode(data.mode as ScienceMode);
      setCurrentChatId(selectedChatId);
      if (data.articleStatus) {
        setStatus(data.articleStatus);
      }
      updateUrl(data.mode, selectedChatId);
    }
    setIsLoadingChat(false);
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    const shouldClear = await deleteChat(chatIdToDelete, currentChatId);
    if (shouldClear) {
      clearMessages();
      setCurrentChatId(null);
      setStatus("idle");
      articleStore.setShowSettings(true);
      updateUrl(mode, null);
    }
  };

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as ScienceMode);
    setStatus("idle");
    setInput("");
    skipPanel.current = false;
    updateUrl(newMode, null);
  };

  const handleEditPlan = () => {
    const lastPlanMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.meta?.type === "structure");

    if (lastPlanMessage) {
      setEditingPlanContent(cleanPlanForEditing(lastPlanMessage.content));
      setIsEditingPlan(true);
    }
  };

  const handleUpdatePlan = async (editedPlanContent: string) => {
    const oldPlanIndex = messages.findIndex(
      (m) => m.meta?.type === "structure" && m.role === "assistant",
    );

    if (oldPlanIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[oldPlanIndex] = {
        ...updatedMessages[oldPlanIndex],
        content: editedPlanContent,
      };

      setMessages(updatedMessages);

      await saveChatToDatabase(
        updatedMessages,
        mode,
        currentChatId,
        "structure_generated",
      );
    }

    setIsEditingPlan(false);
    setStatus("structure_generated");
  };

  const handleCancelEdit = () => {
    setIsEditingPlan(false);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    if (!isArticleMode) {
      const options: SendMessageOptions = {
        customInput: input,
        mode,
        model,
      };
      sendMessage(options);
      setInput("");
      return;
    }

    if (articleStatus === "structure_generated") {
      const options: SendMessageOptions = {
        customInput: input,
        metaType: "article_part",
        mode,
        settings: articleStore.settings,
        model,
      };
      sendMessage(options);
      setInput("");
      return;
    }

    const options: SendMessageOptions = {
      customInput: input,
      metaType: "structure",
      mode,
      model,
    };
    sendMessage(options);
    setStatus("structure_generated");
    setInput("");
  };

  const handleWriteArticle = () => {
    const firstUserMsg = messages.find((m) => m.role === "user");
    const lastAssistantMsg = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.meta?.type === "structure");

    if (!lastAssistantMsg || !firstUserMsg) return;

    const options: SendMessageOptions = {
      customInput: "write_article",
      metaType: "article_part",
      isFullArticle: true,
      mode,
      settings: articleStore.settings,
      skipAddUserMessage: true,
      model,
      topic: firstUserMsg.content,
      existingPlan: lastAssistantMsg.content,
    };
    sendMessage(options);

    setStatus("writing");
    setInput("");
  };

  const handleContinueWriting = () => {
    const options: SendMessageOptions = {
      customInput: "continue",
      metaType: "article_part",
      isFullArticle: true,
      mode,
      settings: articleStore.settings,
      model,
    };
    sendMessage(options);
  };

  const handleResetPlan = () => {
    const lastStructureMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.meta?.type === "structure");

    const errorMessageIndex = messages.findIndex(
      (m) => m.id === lastStructureMessage?.id,
    );

    if (errorMessageIndex !== -1) {
      const newMessages = [...messages];
      newMessages.splice(errorMessageIndex, 1);
      setMessages(newMessages);
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage && messages[messages.length - 1] === lastUserMessage) {
      const newMessages = [...messages];
      newMessages.pop();
      setMessages(newMessages);
    }

    setStatus("idle");
    setInput("");
    setCurrentChatId(null);
  };

  const showWriteButtons =
    isArticleMode &&
    articleStatus === "structure_generated" &&
    messages.length > 0 &&
    !isGenerating;

  const showContinueButton =
    isArticleMode && articleStatus === "writing" && !isGenerating;

  const showCompletedMessage = isArticleMode && articleStatus === "completed";

  const lastStructureMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.meta?.type === "structure");

  const showPlanError =
    isArticleMode &&
    lastStructureMessage &&
    (lastStructureMessage.meta?.isError === true ||
      lastStructureMessage.meta?.isAborted === true);

  const getPlaceholder = () => {
    if (!isArticleMode) {
      return currentMode.placeholder || "Введите сообщение...";
    }

    if (articleStatus === "structure_generated") {
      return "Введите правки к плану...";
    }
    if (articleStatus === "writing") {
      return "Продолжите написание статьи...";
    }
    return currentMode.placeholder || "Введите тему для генерации плана...";
  };

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
          onNewChat={handleNewArticle}
          onDeleteChat={handleDeleteChat}
        />

        <div className="chat-container">
          <ChatHeader
            onNewChat={handleNewArticle}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          <div className="mode-selector-wrapper">
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
          </div>

          {isArticleMode && (
            <div className="header-actions">
              <ScientificArticleSettingsPanel
                model={model}
                onModelChange={setModel}
              />
            </div>
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
                />
              )}
            </div>

            <CyberLoader isVisible={showLoader} />

            {isArticleMode && showPlanError && (
              <div className="article-generate-prompt error">
                <p>
                  <AlertCircle size={18} className="inline-icon" />
                  Ошибка генерации плана. Попробуйте начать заново.
                </p>
                <button
                  className="article-generate-btn reset"
                  onClick={handleResetPlan}
                >
                  <RefreshCw size={16} className="btn-icon" />
                  Начать заново
                </button>
              </div>
            )}

            {!isEditingPlan && showWriteButtons && (
              <div className="article-generate-prompt">
                <p>Структура готова. Начать написание статьи?</p>
                <div className="article-generate-buttons">
                  <button
                    className="article-generate-btn"
                    onClick={handleWriteArticle}
                  >
                    <Rocket className="article-generate-icon" /> Написать статью
                  </button>
                  <button className="article-edit-btn" onClick={handleEditPlan}>
                    <Edit size={16} className="btn-icon" />
                    Исправить план вручную
                  </button>
                </div>
              </div>
            )}

            {isEditingPlan && (
              <PlanEditor
                initialContent={editingPlanContent}
                onUpdatePlan={handleUpdatePlan}
                onCancel={handleCancelEdit}
              />
            )}

            {showContinueButton && (
              <div className="article-generate-prompt">
                <button
                  className="article-generate-btn"
                  onClick={handleContinueWriting}
                >
                  <ChevronRight className="article-generate-icon" /> Продолжить
                  написание статьи
                </button>
                <p className="article-hint">
                  Статья еще не завершена. Нажмите &quot;Продолжить&quot;, чтобы
                  дописать.
                </p>
              </div>
            )}

            {showCompletedMessage && isCompletedMessageVisible && (
              <div className="article-complete-prompt">
                <div className="article-complete-prompt-header">
                  <p>Статья завершена! Вы можете её скачать</p>
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
      {!isEditingPlan && (
        <ChatInput
          input={input}
          setInput={setInput}
          isGenerating={isGenerating}
          onSend={handleSendMessage}
          onStop={stopGeneration}
          placeholder={getPlaceholder()}
          disabled={isGenerating}
          onNewChat={handleNewArticle}
          messages={messages}
          model={model}
          onModelChange={setModel}
        />
      )}
    </>
  );
};

export default ScientificArticleGeneratorContent;
