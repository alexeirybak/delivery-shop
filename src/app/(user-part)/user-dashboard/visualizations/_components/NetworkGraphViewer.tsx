import { useEffect, useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  type Connection,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Move,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { NetworkGraph } from "../types";
import "../styles/network-viewer.css";
import { getNetworkGraphNodeColor } from "../utils/getNetworkGraphNodeColor";

interface NetworkGraphViewerProps {
  data: NetworkGraph;
  onClose?: () => void;
  onSave?: (data: NetworkGraph) => void;
  isSaving?: boolean;
}

type CustomNode = Node<
  { label: string; group?: string; value?: number },
  "default"
>;
type CustomEdge = Edge<{ label?: string; value?: number }>;

const transformToFlow = (
  data: NetworkGraph,
): { nodes: CustomNode[]; edges: CustomEdge[] } => {
  const nodes: CustomNode[] = data.nodes.map((node) => ({
    id: node.id,
    type: "default",
    position: node.position || {
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
    },
    data: {
      label: node.label,
      group: node.group,
      value: node.value,
    },
    style: {
      background: getNetworkGraphNodeColor(node.group),
      border: "2px solid #64748b",
      borderRadius: "50%",
      width: `${Math.min(60 + (node.value || 1) * 5, 120)}px`,
      height: `${Math.min(60 + (node.value || 1) * 5, 120)}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "500",
      color: "#1f1f1f",
      padding: "8px",
      textAlign: "center",
      wordBreak: "break-word",
    },
    draggable: true,
    selectable: true,
  }));

  const edges: CustomEdge[] = data.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "default",
    label: edge.label,
    data: { label: edge.label, value: edge.value },
    markerEnd: { type: MarkerType.ArrowClosed },
    style: {
      stroke: "#94a3b8",
      strokeWidth: Math.min(1 + (edge.value || 1), 5),
    },
    labelStyle: { fontSize: 10, fill: "#64748b" },
    labelBgStyle: { fill: "#f8fafc", fillOpacity: 0.8 },
  }));

  return { nodes, edges };
};

const convertToNetworkGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): NetworkGraph => {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      group: node.data.group,
      value: node.data.value,
      position: { x: node.position.x, y: node.position.y },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.data?.label,
      value: edge.data?.value,
    })),
  };
};

function NetworkGraphViewerContent({
  data,
  onSave,
  isSaving,
}: NetworkGraphViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const reactFlowRef = useRef<ReactFlowInstance<CustomNode, CustomEdge> | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const initFlow = useCallback(() => {
    if (!data) return;
    const { nodes: flowNodes, edges: flowEdges } = transformToFlow(data);
    setNodes(flowNodes);
    setEdges(flowEdges);

    setTimeout(() => {
      if (reactFlowRef.current) {
        reactFlowRef.current.fitView({ padding: 0.2 });
      }
    }, 100);
  }, [data, setNodes, setEdges]);

  const handleSave = () => {
    if (!onSave) return;
    const updatedData = convertToNetworkGraph(nodes, edges);
    onSave(updatedData);
  };

  const handleNodeDoubleClick = (_: React.MouseEvent, node: CustomNode) => {
    setEditingNodeId(node.id);
    setEditingEdgeId(null);
    setEditValue(node.data.label);
    setIsEditing(true);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 50);
  };

  const handleEdgeDoubleClick = (_: React.MouseEvent, edge: CustomEdge) => {
    setEditingEdgeId(edge.id);
    setEditingNodeId(null);
    setEditValue(edge.data?.label || "");
    setIsEditing(true);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 50);
  };

  const handleEditSubmit = useCallback(() => {
    if (editingNodeId && editValue.trim()) {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === editingNodeId
            ? { ...node, data: { ...node.data, label: editValue.trim() } }
            : node,
        ),
      );
    } else if (editingEdgeId && editValue.trim()) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) =>
          edge.id === editingEdgeId
            ? {
                ...edge,
                data: { ...edge.data, label: editValue.trim() },
                label: editValue.trim(),
              }
            : edge,
        ),
      );
    }
    setIsEditing(false);
    setEditingNodeId(null);
    setEditingEdgeId(null);
    setEditValue("");
  }, [editingNodeId, editingEdgeId, editValue, setNodes, setEdges]);

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingNodeId(null);
    setEditingEdgeId(null);
    setEditValue("");
  };

  const handleAddNode = () => {
    const newNodeId = `node-${Date.now()}-${Math.random()}`;
    const newNode: CustomNode = {
      id: newNodeId,
      type: "default",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { label: "Новый узел", group: "default", value: 1 },
      style: {
        background: getNetworkGraphNodeColor("default"),
        border: "2px solid #64748b",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "500",
        color: "#1f1f1f",
        padding: "8px",
        textAlign: "center",
        wordBreak: "break-word",
      },
      draggable: true,
      selectable: true,
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newNodeId);
  };

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
        ),
      );
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
  }, [selectedNodeId, selectedEdgeId, setNodes, setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: CustomNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  };

  const onEdgeClick = (_: React.MouseEvent, edge: CustomEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: CustomEdge = {
        id: `edge-${Date.now()}-${Math.random()}`,
        source: params.source!,
        target: params.target!,
        type: "default",
        label: "связь",
        data: { label: "связь", value: 1 },
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#94a3b8", strokeWidth: 1 },
        labelStyle: { fontSize: 10 },
        labelBgStyle: { fill: "#f8fafc", fillOpacity: 0.8 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  const downloadPNG = async () => {
    try {
      const htmlToImage = await import("html-to-image");
      const element = containerRef.current;
      if (element) {
        const dataUrl = await htmlToImage.toPng(element, {
          backgroundColor: "#ffffff",
          cacheBust: true,
          pixelRatio: 2,
          skipAutoScale: true,
        });
        const link = document.createElement("a");
        link.download = "network-graph.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Ошибка сохранения PNG:", error);
    }
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const zoomIn = () => reactFlowRef.current?.zoomIn();
  const zoomOut = () => reactFlowRef.current?.zoomOut();
  const fitView = () => reactFlowRef.current?.fitView({ padding: 0.2 });

  useEffect(() => {
    initFlow();
  }, [initFlow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.key === "Enter") {
        handleEditSubmit();
      } else if (isEditing && e.key === "Escape") {
        handleEditCancel();
      } else if (
        !isEditing &&
        e.key === "Delete" &&
        (selectedNodeId || selectedEdgeId)
      ) {
        handleDeleteSelected();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isEditing,
    editValue,
    handleEditSubmit,
    selectedNodeId,
    selectedEdgeId,
    handleDeleteSelected,
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  return (
    <div ref={containerRef} className="network-container">
      <div className="network-toolbar">
        <button
          onClick={zoomIn}
          className="network-toolbar-btn"
          title="Приблизить"
        >
          <ZoomIn size={16} />
          <span>+</span>
        </button>
        <button
          onClick={zoomOut}
          className="network-toolbar-btn"
          title="Отдалить"
        >
          <ZoomOut size={16} />
          <span>-</span>
        </button>
        <button
          onClick={fitView}
          className="network-toolbar-btn"
          title="Центрировать граф"
        >
          <Move size={16} />
          <span>Центр</span>
        </button>
        <div className="network-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="network-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="network-toolbar-btn"
          title={
            isFullscreen ? "Выйти из полноэкранного режима" : "Полный экран"
          }
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>
        <div className="network-toolbar-divider" />
        <button
          onClick={handleAddNode}
          className="network-toolbar-btn"
          title="Добавить узел"
        >
          <Plus size={16} />
          <span>Узел</span>
        </button>
        <button
          onClick={handleDeleteSelected}
          className="network-toolbar-btn"
          title="Удалить выбранное (Del)"
        >
          <Trash2 size={16} />
          <span>Удалить</span>
        </button>

        {(selectedNode || selectedEdge) && (
          <span className="selected-item-label">
            Выделено:{" "}
            {selectedNode?.data.label ||
              selectedEdge?.data?.label ||
              selectedEdge?.id}
          </span>
        )}

        {onSave && (
          <>
            <div className="network-toolbar-divider" />
            <button
              onClick={handleSave}
              className="network-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      {isEditing && (editingNodeId || editingEdgeId) && (
        <div className="edit-modal">
          <p className="edit-modal-title">
            {editingNodeId ? "Редактировать узел" : "Редактировать связь"}
          </p>
          <input
            ref={editInputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="edit-modal-input"
          />
          <div className="edit-modal-actions">
            <button
              onClick={handleEditCancel}
              className="edit-modal-btn cancel"
            >
              Отмена
            </button>
            <button onClick={handleEditSubmit} className="edit-modal-btn save">
              Сохранить
            </button>
          </div>
        </div>
      )}

      <ReactFlow<CustomNode, CustomEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowRef.current = instance;
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap />
        <Panel position="top-right">
          <div className="info-panel">
            Клик - выделить | Двойной клик - редактировать | Соединяйте узлы
            мышью
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export const NetworkGraphViewer = (props: NetworkGraphViewerProps) => {
  return (
    <ReactFlowProvider>
      <NetworkGraphViewerContent {...props} />
    </ReactFlowProvider>
  );
};
