"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import { useSendMessage } from "../hooks/useVisualizationSendMessage";
import { formatForScreen } from "../../utils/formatForScreen";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ModeSelector } from "./ModeSelector";
import { CyberLoader } from "../../_components/CyberLoader";
import { VisualizationMode } from "../types";
import { MindmapSettingsPanel } from "./MindmapSettingsPanel";
import { FlowchartSettingsPanel } from "./FlowchartSettingsPanel";
import { NetworkSettingsPanel } from "./NetworkSettingsPanel";
import { BarchartSettingsPanel } from "./BarchartSettingsPanel";
import { PieChartSettingsPanel } from "./PieChartSettingsPanel";
import { RadarChartSettingsPanel } from "./RadarChartSettingsPanel";
import { LineChartSettingsPanel } from "./LineChartSettingsPanel";
import { ComparisonTableSettingsPanel } from "./ComparisonTableSettingsPanel";
import { RoadmapSettingsPanel } from "./RoadmapSettingsPanel";
import { HierarchySettingsPanel } from "./HierarchySettingsPanel";
import { TimelineSettingsPanel } from "./TimelineSettingsPanel";
import { FlashcardsSettingsPanel } from "./FlashcardsSettingsPanel";
import { useMindmapSettingsStore } from "@/store/mindmapSettingsStore";
import { useFlowchartSettingsStore } from "@/store/flowchartSettingsStore";
import { useNetworkSettingsStore } from "@/store/networkSettingsStore";
import { useBarchartSettingsStore } from "@/store/barchartSettingsStore";
import { usePieChartSettingsStore } from "@/store/pieChartSettingsStore";
import { useRadarChartSettingsStore } from "@/store/radarChartSettingsStore";
import { useLineChartSettingsStore } from "@/store/lineChartSettingsStore";
import { useComparisonTableSettingsStore } from "@/store/comparisonTableSettingsStore";
import { useRoadmapSettingsStore } from "@/store/roadmapSettingsStore";
import { useHierarchySettingsStore } from "@/store/hierarchySettingsStore";
import { useTimelineSettingsStore } from "@/store/timelineSettingsStore";
import { useFlashcardsSettingsStore } from "@/store/flashcardsSettingsStore";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  FileData,
  GenerationMode,
  MessageMeta,
  UploadedImage,
} from "../../types";
import { ChatInput } from "./ChatInput";
import { MessageVisualList } from "./MessageVisualList";
import { VISUALIZATION_MODES } from "../utils/visualisationModes";
import "../../styles/generate-page.css";
import { useGlossarySettingsStore } from "@/store/glossarySettingsStore";
import { GlossarySettingsPanel } from "./GlossarySettingsPanel";
import { useRoleplaySettingsStore } from "@/store/roleplaySettingsStore";
import { RoleplaySettingsPanel } from "./RoleplaySettingsPanel";
import { EmptyState } from "../../_components/EmptyState";

const VisualizationPageContent = () => {
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
  const prevModeRef = useRef<VisualizationMode | null>(null);
  const isInitialLoadRef = useRef(true);

  const mindmapStore = useMindmapSettingsStore();
  const flowchartStore = useFlowchartSettingsStore();
  const networkStore = useNetworkSettingsStore();
  const barchartStore = useBarchartSettingsStore();
  const piechartStore = usePieChartSettingsStore();
  const radarchartStore = useRadarChartSettingsStore();
  const linechartStore = useLineChartSettingsStore();
  const comparisonTableStore = useComparisonTableSettingsStore();
  const roadmapStore = useRoadmapSettingsStore();
  const hierarchyStore = useHierarchySettingsStore();
  const timelineStore = useTimelineSettingsStore();
  const flashcardsStore = useFlashcardsSettingsStore();
  const glossaryStore = useGlossarySettingsStore();
  const roleplayStore = useRoleplaySettingsStore();

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
    (newMode: VisualizationMode, newChatId?: string | null) => {
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

  // ИНИЦИАЛИЗАЦИЯ (один раз)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const initialMode = VISUALIZATION_MODES.includes(
        urlMode as VisualizationMode,
      )
        ? (urlMode as VisualizationMode)
        : "mindmap";

      setMode(initialMode);

      if (chatIdFromUrl) {
        setIsLoadingChat(true);
        try {
          const data = await loadChatFromDatabase(chatIdFromUrl);
          if (data) {
            setMessages(data.messages || []);
            if (data.mode !== initialMode) {
              setMode(data.mode as VisualizationMode);
              updateUrl(data.mode as VisualizationMode, chatIdFromUrl);
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

  // Сохраняем ID чата в URL при его изменении
  useEffect(() => {
    if (
      initialized.current &&
      currentChatId &&
      currentChatId !== chatIdFromUrl &&
      !isLoadingChat &&
      !isInitialLoadRef.current
    ) {
      updateUrl(mode as VisualizationMode, currentChatId);
    }
  }, [currentChatId, chatIdFromUrl, mode, isLoadingChat, updateUrl]);

  // Панели настроек (с проверкой на первую загрузку)
  useEffect(() => {
    if (!initialized.current) return;
    if (prevModeRef.current === mode) return;

    if (isInitialLoadRef.current) return;

    prevModeRef.current = mode;

    mindmapStore.setShowSettings(false);
    flowchartStore.setShowSettings(false);
    networkStore.setShowSettings(false);
    barchartStore.setShowSettings(false);
    piechartStore.setShowSettings(false);
    radarchartStore.setShowSettings(false);
    linechartStore.setShowSettings(false);
    comparisonTableStore.setShowSettings(false);
    roadmapStore.setShowSettings(false);
    hierarchyStore.setShowSettings(false);
    timelineStore.setShowSettings(false);
    flashcardsStore.setShowSettings(false);
    glossaryStore.setShowSettings(false);
    roleplayStore.setShowSettings(false);

    if (!skipPanel.current) {
      switch (mode) {
        case "mindmap":
          mindmapStore.setShowSettings(true);
          break;
        case "flowchart":
          flowchartStore.setShowSettings(true);
          break;
        case "network":
          networkStore.setShowSettings(true);
          break;
        case "barchart":
          barchartStore.setShowSettings(true);
          break;
        case "piechart":
          piechartStore.setShowSettings(true);
          break;
        case "radarchart":
          radarchartStore.setShowSettings(true);
          break;
        case "linechart":
          linechartStore.setShowSettings(true);
          break;
        case "visualization_comparison":
          comparisonTableStore.setShowSettings(true);
          break;
        case "roadmap":
          roadmapStore.setShowSettings(true);
          break;
        case "hierarchy":
          hierarchyStore.setShowSettings(true);
          break;
        case "timeline":
          timelineStore.setShowSettings(true);
          break;
        case "flashcards":
          flashcardsStore.setShowSettings(true);
          break;
        case "glossary":
          glossaryStore.setShowSettings(true);
          break;
        case "roleplay":
          roleplayStore.setShowSettings(true);
          break;
        default:
          break;
      }
    }
    skipPanel.current = false;
  }, [
    barchartStore,
    comparisonTableStore,
    flowchartStore,
    hierarchyStore,
    linechartStore,
    mindmapStore,
    mode,
    networkStore,
    piechartStore,
    radarchartStore,
    roadmapStore,
    timelineStore,
    flashcardsStore,
    glossaryStore,
    roleplayStore,
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
    updateUrl(mode as VisualizationMode, null);
  };

  const handleChatSelect = async (selectedChatId: string) => {
    skipPanel.current = true;
    setIsLoadingChat(true);
    const data = await loadChatFromDatabase(selectedChatId);
    if (data) {
      mindmapStore.setShowSettings(false);
      flowchartStore.setShowSettings(false);
      networkStore.setShowSettings(false);
      barchartStore.setShowSettings(false);
      piechartStore.setShowSettings(false);
      radarchartStore.setShowSettings(false);
      linechartStore.setShowSettings(false);
      comparisonTableStore.setShowSettings(false);
      roadmapStore.setShowSettings(false);
      hierarchyStore.setShowSettings(false);
      timelineStore.setShowSettings(false);
      flashcardsStore.setShowSettings(false);
      glossaryStore.setShowSettings(false);
      roleplayStore.setShowSettings(false);

      setMessages(data.messages);
      setMode(data.mode as VisualizationMode);
      setCurrentChatId(selectedChatId);
      updateUrl(data.mode as VisualizationMode, selectedChatId);
    }
    setIsLoadingChat(false);
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (await deleteChat(chatIdToDelete, currentChatId)) {
      clearMessages();
      setCurrentChatId(null);
      updateUrl(mode as VisualizationMode, null);
    }
  };

  const handleModeChange = (newMode: GenerationMode) => {
    clearChat();
    createNewChat();
    setMode(newMode as VisualizationMode);
    setInput("");
    skipPanel.current = false;
    updateUrl(newMode as VisualizationMode, null);
  };

  const handleSendMessage = () => {
    if (!input.trim() && !images.length && !file) return;

    const settingsMap = {
      mindmap: mindmapStore.settings,
      flowchart: flowchartStore.settings,
      network: networkStore.settings,
      barchart: barchartStore.settings,
      piechart: piechartStore.settings,
      radarchart: radarchartStore.settings,
      linechart: linechartStore.settings,
      visualization_comparison: comparisonTableStore.settings,
      roadmap: roadmapStore.settings,
      hierarchy: hierarchyStore.settings,
      timeline: timelineStore.settings,
      flashcards: flashcardsStore.settings,
      glossary: glossaryStore.settings,
      roleplay: roleplayStore.settings,
    };

    const currentSettings = settingsMap[mode as keyof typeof settingsMap];

    sendMessage(input, images, currentSettings, file);
    setInput("");
    setImages([]);
    setFile(null);
  };

  const retryLastMessage = () => {
    if (isGenerating) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) sendMessage(lastUserMsg.content);
  };

  const updateMessage = (messageId: string, newMeta: MessageMeta) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, meta: newMeta } : msg,
      ),
    );
  };

  if (isLoadingChat && chatIdFromUrl && isInitialLoadRef.current) {
    return (
      <div className="dashboard-loading-state">
        <CyberLoader />
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

          <div className="header-actions">
            {mode === "mindmap" && <MindmapSettingsPanel />}
            {mode === "flowchart" && <FlowchartSettingsPanel />}
            {mode === "network" && <NetworkSettingsPanel />}
            {mode === "barchart" && <BarchartSettingsPanel />}
            {mode === "piechart" && <PieChartSettingsPanel />}
            {mode === "radarchart" && <RadarChartSettingsPanel />}
            {mode === "linechart" && <LineChartSettingsPanel />}
            {mode === "visualization_comparison" && (
              <ComparisonTableSettingsPanel />
            )}
            {mode === "roadmap" && <RoadmapSettingsPanel />}
            {mode === "hierarchy" && <HierarchySettingsPanel />}
            {mode === "timeline" && <TimelineSettingsPanel />}
            {mode === "flashcards" && <FlashcardsSettingsPanel />}
            {mode === "glossary" && <GlossarySettingsPanel />}
            {mode === "roleplay" && <RoleplaySettingsPanel />}
          </div>

          <div className="chat-content">
            <div className="messages-area" ref={messagesContainerRef}>
              {messages.length === 0 ? (
                <EmptyState
                  modeLabel={currentMode.label}
                  modeDescription={currentMode.description}
                />
              ) : (
                <MessageVisualList
                  messages={messages}
                  copiedId={copiedId}
                  onCopy={copyMessage}
                  onRetry={
                    messages.length && !isGenerating
                      ? retryLastMessage
                      : undefined
                  }
                  onUpdateMessage={updateMessage}
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

export default VisualizationPageContent;
