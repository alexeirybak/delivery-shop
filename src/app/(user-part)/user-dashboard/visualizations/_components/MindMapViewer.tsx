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
import {
  MindMapNode,
  MindMapViewerProps,
} from "../types/visualizations.types";
import "../styles/mindmap-viewer.css";
import { mindmapColors } from "../utils/mindmapColors";

interface ExtendedMindMapViewerProps extends MindMapViewerProps {
  onSave?: (data: MindMapNode) => void;
  isSaving?: boolean;
}

type CustomNode = Node<{ label: string; originalName?: string }, "default">;
type CustomEdge = Edge;

const transformToFlow = (
  data: MindMapNode,
  parentId?: string,
  x = 0,
  y = 0,
  level = 0,
): { nodes: CustomNode[]; edges: CustomEdge[] } => {
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];
  const nodeId = `node-${Date.now()}-${Math.random()}-${level}-${data.name.replace(/\s/g, "")}`;

  const horizontalSpacing = 320;
  const verticalSpacing = 120;

  const colorIndex = Math.min(level, mindmapColors.length - 1);
  const color = mindmapColors[colorIndex];

  const textLength = data.name.length;
  const nodeWidth = Math.min(Math.max(textLength * 8, 120), 280);

  nodes.push({
    id: nodeId,
    type: "default",
    position: data.position || {
      x: x + level * horizontalSpacing,
      y: y + level * verticalSpacing,
    },
    data: { label: data.name, originalName: data.name },
    style: {
      background: color.bg,
      border: `2px solid ${color.border}`,
      color: color.text,
      width: `${nodeWidth}px`,
      minHeight: "44px",
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: parentId,
    draggable: true,
    selectable: true,
  });

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: "default",
      markerEnd: MarkerType.ArrowClosed,
      style: { stroke: "#cbd5e1", strokeWidth: 2 },
    });
  }

  if (data.children && data.children.length > 0) {
    const childCount = data.children.length;
    const startY = y - ((childCount - 1) * verticalSpacing) / 2;

    data.children.forEach((child, index) => {
      const childY = startY + index * verticalSpacing;
      const { nodes: childNodes, edges: childEdges } = transformToFlow(
        child,
        nodeId,
        x + 280,
        childY,
        level + 1,
      );
      nodes.push(...childNodes);
      edges.push(...childEdges);
    });
  }

  return { nodes, edges };
};

const convertToMindMapNode = (
  nodes: CustomNode[],
  rootId: string,
): MindMapNode => {
  const rootNode = nodes.find((n) => n.id === rootId);
  if (!rootNode) return { name: "" };

  const children = nodes
    .filter((n) => n.parentId === rootId)
    .map((n) => convertToMindMapNode(nodes, n.id));

  return {
    name: rootNode.data.label,
    children: children.length > 0 ? children : undefined,
    position: { x: rootNode.position.x, y: rootNode.position.y },
  };
};

function MindMapViewerContent({ data, onSave }: ExtendedMindMapViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const reactFlowRef = useRef<ReactFlowInstance<CustomNode, CustomEdge> | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
        link.download = "mindmap.png";
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

  const zoomIn = () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.zoomOut();
    }
  };

  const fitView = () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.fitView({ padding: 0.2 });
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

  const handleSave = () => {
    if (!onSave) return;

    const rootNode = nodes.find((n) => !n.parentId);
    if (rootNode) {
      const updatedData = convertToMindMapNode(nodes, rootNode.id);
      onSave(updatedData);
    }
  };

  const findAllChildren = useCallback(
    (nodeId: string, nodesList: CustomNode[]): string[] => {
      const children = nodesList
        .filter((n) => n.parentId === nodeId)
        .map((n) => n.id);
      const grandchildren = children.flatMap((childId) =>
        findAllChildren(childId, nodesList),
      );
      return [...children, ...grandchildren];
    },
    [],
  );

  const handleAddNode = () => {
    let parentId = selectedNodeId;
    if (!parentId) {
      const rootNode = nodes.find((n) => !n.parentId);
      if (rootNode) {
        parentId = rootNode.id;
      } else {
        alert("Сначала выделите узел, к которому хотите добавить дочерний");
        return;
      }
    }

    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    const newNodeId = `node-${Date.now()}-${Math.random()}`;

    const newPosition = {
      x: parentNode.position.x + 280,
      y: parentNode.position.y + (Math.random() * 100 - 50),
    };

    const newNode: CustomNode = {
      id: newNodeId,
      type: "default",
      position: newPosition,
      data: { label: "Новый узел" },
      style: {
        background: "#d1fae5",
        border: "2px solid #10b981",
        color: "#1f1f1f",
        width: "120px",
        minHeight: "44px",
      },
      parentId: parentId,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const newEdge: CustomEdge = {
      id: `edge-${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      type: "default",
      markerEnd: MarkerType.ArrowClosed,
      style: { stroke: "#cbd5e1", strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);

    setTimeout(() => {
      if (reactFlowRef.current) {
        reactFlowRef.current.fitView({ padding: 0.2, duration: 300 });
      }
    }, 50);
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

    const childrenToDelete = findAllChildren(selectedNodeId, nodes);
    const allIdsToDelete = [selectedNodeId, ...childrenToDelete];

    setNodes((nds) => nds.filter((n) => !allIdsToDelete.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !allIdsToDelete.includes(e.source) &&
          !allIdsToDelete.includes(e.target),
      ),
    );

    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, findAllChildren, setNodes, setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: CustomNode) => {
    setSelectedNodeId(node.id);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: "default" }, eds));
    },
    [setEdges],
  );

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
    <div ref={containerRef} className="mindmap-container">
      <div className="mindmap-toolbar">
        <button
          onClick={zoomIn}
          className="mindmap-toolbar-btn"
          title="Приблизить"
        >
          <ZoomIn size={16} />
          <span>+</span>
        </button>
        <button
          onClick={zoomOut}
          className="mindmap-toolbar-btn"
          title="Отдалить"
        >
          <ZoomOut size={16} />
          <span>-</span>
        </button>
        <button
          onClick={fitView}
          className="mindmap-toolbar-btn"
          title="Центрировать карту"
        >
          <Move size={16} />
          <span>Центр</span>
        </button>
        <div className="mindmap-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="mindmap-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="mindmap-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        <div className="mindmap-toolbar-divider" />
        <button
          onClick={handleAddNode}
          className="mindmap-toolbar-btn"
          title="Добавить узел"
        >
          <Plus size={16} />
          <span>Узел</span>
        </button>
        <button
          onClick={handleDeleteNode}
          className="mindmap-toolbar-btn"
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
            <div className="mindmap-toolbar-divider" />
            <button
              onClick={handleSave}
              className="mindmap-toolbar-btn"
              title="Сохранить изменения"
            >
              <Save size={16} />
              <span>Сохранить</span>
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
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

export const MindMapViewer = (props: ExtendedMindMapViewerProps) => {
  return (
    <ReactFlowProvider>
      <MindMapViewerContent {...props} />
    </ReactFlowProvider>
  );
};