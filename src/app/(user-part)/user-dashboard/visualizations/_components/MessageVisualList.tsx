import { useRef, useEffect, useState, useCallback } from "react";
import { User, Bot, Copy, Check, Repeat } from "lucide-react";
import { FormattedText } from "../../_components/FormattedText";
import { formatForScreen } from "../../utils/formatForScreen";
import { MindMapViewer } from "./MindMapViewer";
import { FlowchartViewer } from "./FlowchartViewer";
import { NetworkGraphViewer } from "./NetworkGraphViewer";
import { BarchartViewer } from "./BarchartViewer";
import { PieChartViewer } from "./PieChartViewer";
import { RadarChartViewer } from "./RadarChartViewer";
import { LineChartViewer } from "./LineChartViewer";
import { ComparisonTableViewer } from "./ComparisonTableViewer";
import { RoadmapViewer } from "./RoadmapViewer/RoadmapViewer";
import { HierarchyViewer } from "./HierarchyViewer";
import { TimelineViewer } from "./TimelineViewer";
import { FlashcardsViewer } from "./FlashcardsViewer";
import { GlossaryViewer } from "./GlossaryViewer";
import { RoleplayViewer } from "./RoleplayViewer";
import { MessageListProps, MessageMeta } from "../../types";


import { formatTime } from "../../utils/formatTime";
import "../../styles/message-list.css";
import { ChartData, ComparisonTableData, FlashcardData, FlowchartNode, GlossaryData, HierarchyData, LineChartData, MindMapNode, NetworkGraph, PieChartData, RadarChartData, RoadmapData, RoleplayScenario, TimelineData } from "../types";

const isMindMapNode = (data: unknown): data is MindMapNode => {
  return (
    data !== null &&
    typeof data === "object" &&
    "name" in data &&
    typeof (data as MindMapNode).name === "string"
  );
};

const isFlowchartNode = (data: unknown): data is FlowchartNode => {
  return (
    data !== null &&
    typeof data === "object" &&
    "id" in data &&
    "type" in data &&
    "label" in data
  );
};

const isNetworkGraph = (data: unknown): data is NetworkGraph => {
  return (
    data !== null &&
    typeof data === "object" &&
    "nodes" in data &&
    "edges" in data &&
    Array.isArray((data as NetworkGraph).nodes) &&
    Array.isArray((data as NetworkGraph).edges)
  );
};

const isChartData = (data: unknown): data is ChartData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "labels" in data &&
    "datasets" in data &&
    Array.isArray((data as ChartData).labels) &&
    Array.isArray((data as ChartData).datasets)
  );
};

const isPieChartData = (data: unknown): data is PieChartData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as PieChartData).data) &&
    (data as PieChartData).data.length > 0 &&
    (data as PieChartData).data.every(
      (item) =>
        item && typeof item === "object" && "name" in item && "value" in item,
    )
  );
};

const isRadarChartData = (data: unknown): data is RadarChartData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "labels" in data &&
    "datasets" in data &&
    Array.isArray((data as RadarChartData).labels) &&
    Array.isArray((data as RadarChartData).datasets) &&
    (data as RadarChartData).datasets.length > 0 &&
    (data as RadarChartData).datasets.every(
      (dataset) =>
        dataset &&
        typeof dataset === "object" &&
        "label" in dataset &&
        "data" in dataset &&
        Array.isArray(dataset.data),
    )
  );
};

const isLineChartData = (data: unknown): data is LineChartData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "labels" in data &&
    "datasets" in data &&
    Array.isArray((data as LineChartData).labels) &&
    Array.isArray((data as LineChartData).datasets) &&
    (data as LineChartData).datasets.length > 0 &&
    (data as LineChartData).datasets.every(
      (dataset) =>
        dataset &&
        typeof dataset === "object" &&
        "label" in dataset &&
        "data" in dataset &&
        Array.isArray(dataset.data),
    )
  );
};

const isComparisonTableData = (data: unknown): data is ComparisonTableData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "headers" in data &&
    "rows" in data &&
    Array.isArray((data as ComparisonTableData).headers) &&
    Array.isArray((data as ComparisonTableData).rows) &&
    (data as ComparisonTableData).headers.length > 0 &&
    (data as ComparisonTableData).rows.length > 0
  );
};

const isRoadmapData = (data: unknown): data is RoadmapData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "phases" in data &&
    Array.isArray((data as RoadmapData).phases) &&
    (data as RoadmapData).phases.length > 0 &&
    (data as RoadmapData).phases.every(
      (phase) =>
        phase &&
        typeof phase === "object" &&
        "name" in phase &&
        "tasks" in phase &&
        Array.isArray(phase.tasks),
    )
  );
};

const isHierarchyData = (data: unknown): data is HierarchyData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "id" in data &&
    "name" in data &&
    ("children" in data
      ? Array.isArray((data as HierarchyData).children)
      : true)
  );
};

const isTimelineData = (data: unknown): data is TimelineData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "events" in data &&
    Array.isArray((data as TimelineData).events) &&
    (data as TimelineData).events.length > 0 &&
    (data as TimelineData).events.every(
      (event) =>
        event &&
        typeof event === "object" &&
        "id" in event &&
        "date" in event &&
        "title" in event,
    )
  );
};

const isFlashcardData = (data: unknown): data is FlashcardData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "name" in data &&
    "cards" in data &&
    Array.isArray((data as FlashcardData).cards) &&
    (data as FlashcardData).cards.length > 0 &&
    (data as FlashcardData).cards.every(
      (card) =>
        card &&
        typeof card === "object" &&
        "question" in card &&
        "answer" in card,
    )
  );
};

const isGlossaryDeck = (data: unknown): data is GlossaryData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "title" in data &&
    "terms" in data &&
    Array.isArray((data as GlossaryData).terms) &&
    (data as GlossaryData).terms.length > 0 &&
    (data as GlossaryData).terms.every(
      (term) =>
        term &&
        typeof term === "object" &&
        "term" in term &&
        "definition" in term,
    )
  );
};

const isRoleplayScenario = (data: unknown): data is RoleplayScenario => {
  return (
    data !== null &&
    typeof data === "object" &&
    "title" in data &&
    "role" in data &&
    "situation" in data &&
    "choices" in data &&
    Array.isArray((data as RoleplayScenario).choices)
  );
};

export const MessageVisualList = ({
  messages,
  copiedId,
  onCopy,
  onRetry,
  onUpdateMessage,
}: MessageListProps & {
  onUpdateMessage?: (messageId: string, newMeta: MessageMeta) => void;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [visibleVisualizations, setVisibleVisualizations] = useState<
    Set<string>
  >(new Set());
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const vizIds = messages
        .filter(
          (msg) =>
            !msg.meta?.isError &&
            (msg.meta?.type === "mindmap" ||
              msg.meta?.type === "flowchart" ||
              msg.meta?.type === "network" ||
              msg.meta?.type === "barchart" ||
              msg.meta?.type === "piechart" ||
              msg.meta?.type === "radarchart" ||
              msg.meta?.type === "linechart" ||
              msg.meta?.type === "visualization_comparison" ||
              msg.meta?.type === "roadmap" ||
              msg.meta?.type === "hierarchy" ||
              msg.meta?.type === "timeline" ||
              msg.meta?.type === "flashcards" ||
              msg.meta?.type === "glossary" ||
              msg.meta?.type === "roleplay") &&
            msg.meta?.jsonData,
        )
        .map((msg) => msg.id)
        .filter((id): id is string => id !== undefined);
      if (vizIds.length > 0) {
        setVisibleVisualizations(new Set(vizIds));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSaveVisualization = useCallback(
    async (
      messageId: string,
      updatedData:
        | MindMapNode
        | FlowchartNode
        | NetworkGraph
        | ChartData
        | PieChartData
        | RadarChartData
        | LineChartData
        | ComparisonTableData
        | RoadmapData
        | HierarchyData
        | TimelineData
        | FlashcardData
        | GlossaryData
        | RoleplayScenario,
    ) => {
      if (updatingMessageId) return;
      setUpdatingMessageId(messageId);

      try {
        const message = messages.find((m) => m.id === messageId);
        if (!message || !message.meta) return;

        const updatedMeta: MessageMeta = {
          ...message.meta,
          jsonData: updatedData,
        };

        const response = await fetch("/api/visualizations/update-meta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId,
            meta: updatedMeta,
          }),
        });

        const responseData = await response.json();
        console.log("Response:", response.status, responseData);

        if (response.ok && onUpdateMessage) {
          onUpdateMessage(messageId, updatedMeta);
        } else {
          console.error("Ошибка сохранения визуализации:", responseData);
          alert("Не удалось сохранить визуализацию");
        }
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
      } finally {
        setUpdatingMessageId(null);
      }
    },
    [messages, onUpdateMessage, updatingMessageId],
  );

  if (messages.length === 0) {
    return null;
  }

  const getVisualizationData = (meta?: MessageMeta) => {
    if (!meta?.jsonData || meta.isError) return null;

    if (meta.type === "mindmap" && isMindMapNode(meta.jsonData)) {
      return { type: "mindmap", data: meta.jsonData };
    }
    if (meta.type === "flowchart" && isFlowchartNode(meta.jsonData)) {
      return { type: "flowchart", data: meta.jsonData };
    }
    if (meta.type === "network" && isNetworkGraph(meta.jsonData)) {
      return { type: "network", data: meta.jsonData };
    }
    if (meta.type === "barchart" && isChartData(meta.jsonData)) {
      return { type: "barchart", data: meta.jsonData };
    }
    if (meta.type === "piechart" && isPieChartData(meta.jsonData)) {
      return { type: "piechart", data: meta.jsonData };
    }
    if (meta.type === "radarchart" && isRadarChartData(meta.jsonData)) {
      return { type: "radarchart", data: meta.jsonData };
    }
    if (meta.type === "linechart" && isLineChartData(meta.jsonData)) {
      return { type: "linechart", data: meta.jsonData };
    }
    if (
      meta.type === "visualization_comparison" &&
      isComparisonTableData(meta.jsonData)
    ) {
      return { type: "visualization_comparison", data: meta.jsonData };
    }
    if (meta.type === "roadmap" && isRoadmapData(meta.jsonData)) {
      return { type: "roadmap", data: meta.jsonData };
    }
    if (meta.type === "hierarchy" && isHierarchyData(meta.jsonData)) {
      return { type: "hierarchy", data: meta.jsonData };
    }
    if (meta.type === "timeline" && isTimelineData(meta.jsonData)) {
      return { type: "timeline", data: meta.jsonData };
    }
    if (meta.type === "flashcards" && isFlashcardData(meta.jsonData)) {
      return { type: "flashcards", data: meta.jsonData };
    }
    if (meta.type === "glossary" && isGlossaryDeck(meta.jsonData)) {
      return { type: "glossary", data: meta.jsonData };
    }
    if (meta.type === "roleplay" && isRoleplayScenario(meta.jsonData)) {
      return { type: "roleplay", data: meta.jsonData };
    }
    return null;
  };

  return (
    <div className="chat-messages">
      {messages.map((msg) => {
        if (msg.meta?.isError) {
          return (
            <div
              key={msg.id || `msg-${Date.now()}-${Math.random()}`}
              className={`chat-message ${msg.role}`}
            >
              <div className="message-avatar">
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-wrapper">
                <div className="message-content error-message">
                  <FormattedText text={msg.content} isStreaming={false} />
                </div>
                <div className="message-footer">
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                  {!msg.isStreaming && msg.content && msg.id && (
                    <button
                      onClick={() => onCopy(msg.content, msg.id!)}
                      className="copy-btn"
                      title="Копировать"
                    >
                      {copiedId === msg.id ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  )}
                  {onRetry && msg.role === "assistant" && !msg.isStreaming && (
                    <button
                      className="retry-btn"
                      onClick={onRetry}
                      title="Повторить последний запрос"
                    >
                      <Repeat size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }

        const vizData = getVisualizationData(msg.meta);
        const isVisible = msg.id ? visibleVisualizations.has(msg.id) : false;
        const isUpdating = msg.id ? updatingMessageId === msg.id : false;

        return (
          <div
            key={msg.id || `msg-${Date.now()}-${Math.random()}`}
            className={`chat-message ${msg.role}`}
          >
            <div className="message-avatar">
              {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-wrapper">
              <div
                className={`message-content ${msg.isStreaming ? "streaming" : ""}`}
              >
                {msg.content && (
                  <FormattedText
                    text={
                      msg.isStreaming
                        ? msg.content
                        : formatForScreen(msg.content)
                    }
                    isStreaming={!!msg.isStreaming}
                  />
                )}

                {!msg.isStreaming && vizData && isVisible && msg.id && (
                  <div className="visualization-viewer-overflow">
                    {vizData.type === "mindmap" && (
                      <MindMapViewer
                        data={vizData.data as MindMapNode}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "flowchart" && (
                      <FlowchartViewer
                        data={vizData.data as FlowchartNode}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "network" && (
                      <NetworkGraphViewer
                        data={vizData.data as NetworkGraph}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "barchart" && (
                      <BarchartViewer
                        data={vizData.data as ChartData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "piechart" && (
                      <PieChartViewer
                        data={vizData.data as PieChartData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "radarchart" && (
                      <RadarChartViewer
                        data={vizData.data as RadarChartData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "linechart" && (
                      <LineChartViewer
                        data={vizData.data as LineChartData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "visualization_comparison" && (
                      <ComparisonTableViewer
                        data={vizData.data as ComparisonTableData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "roadmap" && (
                      <RoadmapViewer
                        data={vizData.data as RoadmapData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "hierarchy" && (
                      <HierarchyViewer
                        data={vizData.data as HierarchyData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "timeline" && (
                      <TimelineViewer
                        data={vizData.data as TimelineData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "flashcards" && (
                      <FlashcardsViewer
                        data={vizData.data as FlashcardData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "glossary" && (
                      <GlossaryViewer
                        data={vizData.data as GlossaryData}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                    {vizData.type === "roleplay" && (
                      <RoleplayViewer
                        data={vizData.data as RoleplayScenario}
                        onClose={() => {}}
                        onSave={(updatedData) =>
                          handleSaveVisualization(msg.id!, updatedData)
                        }
                        isSaving={isUpdating}
                      />
                    )}
                  </div>
                )}

                {msg.isStreaming && <span className="cursor-blink">|</span>}
              </div>
              <div className="message-footer">
                <span className="message-time">
                  {formatTime(msg.timestamp)}
                </span>
                {!msg.isStreaming && msg.content && msg.id && (
                  <button
                    onClick={() => onCopy(msg.content, msg.id!)}
                    className="copy-btn"
                    title="Копировать"
                  >
                    {copiedId === msg.id ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                )}
                {onRetry && msg.role === "assistant" && !msg.isStreaming && (
                  <button
                    className="retry-btn"
                    onClick={onRetry}
                    title="Повторить последний запрос"
                  >
                    <Repeat size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
