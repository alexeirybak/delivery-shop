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
  Position,
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
import { FlowchartNode as FlowchartNodeType } from "../types";
import { getNodeStyle } from "../utils/getNodeStyle";
import "../styles/flowchart-viewer.css";

interface FlowchartViewerProps {
  data: FlowchartNodeType;
  onClose?: () => void;
  onSave?: (data: FlowchartNodeType) => void;
  isSaving?: boolean;
}

type CustomNode = Node<{ label: string; nodeType: string }, "default">;
type CustomEdge = Edge;

const transformToFlow = (
  data: FlowchartNodeType,
  parentId?: string,
  x = 250,
  y = 50,
): { nodes: CustomNode[]; edges: CustomEdge[] } => {
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];
  const idMap = new Map<string, string>(); 

  const processNode = (
    node: FlowchartNodeType,
    currentX: number,
    currentY: number,
    pId?: string,
  ) => {
    const newNodeId = `node-${Date.now()}-${Math.random()}-${nodes.length}`;

    if (node.id) {
      idMap.set(node.id, newNodeId);
    }

    const position = node.position || { x: currentX, y: currentY };

    nodes.push({
      id: newNodeId,
      type: "default",
      position: position,
      data: { label: node.label, nodeType: node.type },
      style: {
        ...getNodeStyle(node.type),
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "500",
        width: "180px",
        minHeight: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#1f1f1f",
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      parentId: pId,
      draggable: true,
      selectable: true,
    });

    if (pId) {
      edges.push({
        id: `edge-${pId}-${newNodeId}`,
        source: pId,
        target: newNodeId,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#cbd5e1", strokeWidth: 2 },
      });
    }

    if (node.children && node.children.length > 0) {
      const childCount = node.children.length;
      const hasChildrenPositions = node.children.every(
        (child) => child.position,
      );

      if (hasChildrenPositions) {
        node.children.forEach((child) => {
          processNode(child, 0, 0, newNodeId);
        });
      } else {
        const startX = currentX - ((childCount - 1) * 220) / 2;
        node.children.forEach((child, index) => {
          const childX = startX + index * 220;
          processNode(child, childX, currentY + 120, newNodeId);
        });
      }
    }
  };

  processNode(data, x, y, parentId);
  return { nodes, edges };
};

const convertToFlowchartNode = (
  nodes: CustomNode[],
  edges: CustomEdge[],
  rootId: string,
): FlowchartNodeType => {
  const rootNode = nodes.find((n) => n.id === rootId);
  if (!rootNode) return { id: rootId, type: "process", label: "" };

  const childEdges = edges.filter((e) => e.source === rootId);
  const children = childEdges.map((edge) =>
    convertToFlowchartNode(nodes, edges, edge.target),
  );

  return {
    id: rootNode.id,
    type: rootNode.data.nodeType as FlowchartNodeType["type"],
    label: rootNode.data.label,
    children: children.length > 0 ? children : undefined,
    position: { x: rootNode.position.x, y: rootNode.position.y },
  };
};

function FlowchartViewerContent({
  data,
  onSave,
  isSaving,
}: FlowchartViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const reactFlowRef = useRef<ReactFlowInstance<CustomNode, CustomEdge> | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

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

    const rootNode = nodes.find((n) => !n.parentId);
    if (rootNode) {
      const updatedData = convertToFlowchartNode(nodes, edges, rootNode.id);
      onSave(updatedData);
    }
  };

  const handleNodeDoubleClick = (_: React.MouseEvent, node: CustomNode) => {
    setEditingNodeId(node.id);
    setEditValue(node.data.label);
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
    }
    setIsEditing(false);
    setEditingNodeId(null);
    setEditValue("");
  }, [editValue, editingNodeId, setNodes]);

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingNodeId(null);
    setEditValue("");
  };

  const handleAddNode = () => {
    if (!selectedNodeId) {
      alert("Сначала выделите узел, к которому хотите добавить дочерний");
      return;
    }

    const parentNode = nodes.find((n) => n.id === selectedNodeId);
    if (!parentNode) return;

    const newNodeId = `node-${Date.now()}-${Math.random()}-${nodes.length}`;
    const newPosition = {
      x: parentNode.position.x,
      y: parentNode.position.y + 120,
    };

    const newNode: CustomNode = {
      id: newNodeId,
      type: "default",
      position: newPosition,
      data: { label: "Новый узел", nodeType: "process" },
      style: {
        ...getNodeStyle("process"),
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "500",
        width: "180px",
        minHeight: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#1f1f1f",
      },
      parentId: selectedNodeId,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    const newEdge: CustomEdge = {
      id: `edge-${selectedNodeId}-${newNodeId}`,
      source: selectedNodeId,
      target: newNodeId,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#cbd5e1", strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return;

    const nodeToDelete = nodes.find((n) => n.id === selectedNodeId);
    if (!nodeToDelete) return;

    const isRoot = !nodeToDelete.parentId;
    if (isRoot) {
      alert("Нельзя удалить корневой узел");
      return;
    }

    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
      ),
    );
    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, setNodes, setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: CustomNode) => {
    setSelectedNodeId(node.id);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds));
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
        link.download = "flowchart.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Ошибка сохранения PNG:", error);
    }
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!isFullscreen) {
      element?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const zoomIn = () => reactFlowRef.current?.zoomIn();
  const zoomOut = () => reactFlowRef.current?.zoomOut();
  const fitView = () => reactFlowRef.current?.fitView({ padding: 0.2 });

  useEffect(() => {
    initFlow();
  }, [initFlow]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.key === "Enter") {
        handleEditSubmit();
      } else if (isEditing && e.key === "Escape") {
        handleEditCancel();
      } else if (!isEditing && e.key === "Delete" && selectedNodeId) {
        handleDeleteNode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isEditing,
    editValue,
    handleEditSubmit,
    selectedNodeId,
    handleDeleteNode,
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div ref={containerRef} className="flowchart-container">
      <div className="flowchart-toolbar">
        <button
          onClick={zoomIn}
          className="flowchart-toolbar-btn"
          title="Приблизить"
        >
          <ZoomIn size={16} />
          <span>+</span>
        </button>
        <button
          onClick={zoomOut}
          className="flowchart-toolbar-btn"
          title="Отдалить"
        >
          <ZoomOut size={16} />
          <span>-</span>
        </button>
        <button
          onClick={fitView}
          className="flowchart-toolbar-btn"
          title="Центрировать схему"
        >
          <Move size={16} />
          <span>Центр</span>
        </button>
        <div className="flowchart-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="flowchart-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flowchart-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>
        <div className="flowchart-toolbar-divider" />
        <button
          onClick={handleAddNode}
          className="flowchart-toolbar-btn"
          title="Добавить узел"
        >
          <Plus size={16} />
          <span>Узел</span>
        </button>
        <button
          onClick={handleDeleteNode}
          className="flowchart-toolbar-btn"
          title="Удалить выбранный узел (Del)"
        >
          <Trash2 size={16} />
          <span>Удалить</span>
        </button>

        {selectedNode && (
          <span className="selected-node-label">
            Выделен: {selectedNode.data.label}
          </span>
        )}

        {onSave && (
          <>
            <div className="flowchart-toolbar-divider" />
            <button
              onClick={handleSave}
              className="flowchart-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      {isEditing && editingNodeId && (
        <div className="edit-modal">
          <p className="edit-modal-title">Редактировать узел</p>
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
        onNodeClick={onNodeClick}
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
            Клик - выделить | Двойной клик - редактировать | Del - удалить
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export const FlowchartViewer = (props: FlowchartViewerProps) => {
  return (
    <ReactFlowProvider>
      <FlowchartViewerContent {...props} />
    </ReactFlowProvider>
  );
};