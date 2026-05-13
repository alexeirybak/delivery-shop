import { useEffect, useRef, useState } from "react";
import {
  Download,
  Maximize2,
  Save,
  Plus,
  Trash2,
  Edit2,
  FolderTree,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { HierarchyData } from "../types/visualizations.types";
import "../styles/hierarchy-viewer.css";
import html2canvas from "html2canvas";
import { levelColors } from "../utils/levelColors";

interface HierarchyViewerProps {
  data: HierarchyData;
  onClose?: () => void;
  onSave?: (data: HierarchyData) => void;
  isSaving?: boolean;
}

interface TreeNodeProps {
  node: HierarchyData;
  level: number;
  onEdit: (node: HierarchyData) => void;
  onDelete: (node: HierarchyData) => void;
  onAdd: (parentNode: HierarchyData) => void;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
}

const TreeNode = ({
  node,
  level,
  onEdit,
  onDelete,
  onAdd,
  selectedId,
  onSelect,
  expandedNodes,
  onToggleExpand,
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;
  const colors = levelColors[level % levelColors.length];

  return (
    <div className="hierarchy-tree-node-wrapper">
      <div
        className={`hierarchy-tree-node-content ${isSelected ? "selected" : ""}`}
        onClick={() => onSelect(node.id)}
        style={{
          background: `linear-gradient(135deg, ${colors.from}10, ${colors.to}05)`,
          borderColor: isSelected ? colors.from : undefined,
        }}
      >
        <div className="hierarchy-tree-node-expand">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.id);
              }}
              className="hierarchy-tree-expand-btn"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}
          {!hasChildren && <span className="hierarchy-tree-placeholder" />}
        </div>

        <div
          className="hierarchy-tree-node-icon"
          style={{ color: colors.from }}
        >
          {hasChildren ? <FolderTree size={16} /> : <FileText size={16} />}
        </div>

        <div className="hierarchy-tree-node-name">
          <span className="hierarchy-tree-node-title">{node.name}</span>
          {node.description && (
            <span className="hierarchy-tree-node-description">
              {" "}
              — {node.description}
            </span>
          )}
        </div>

        <div className="hierarchy-tree-node-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="hierarchy-tree-edit-btn"
            title="Редактировать"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(node);
            }}
            className="hierarchy-tree-add-btn"
            title="Добавить потомка"
          >
            <Plus size={12} />
          </button>
          {node.id !== "root" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              className="hierarchy-tree-delete-btn"
              title="Удалить"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="hierarchy-tree-node-children">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function HierarchyViewerContent({
  data,
  onSave,
  isSaving,
}: HierarchyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNode, setEditNode] = useState<HierarchyData | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hierarchyData, setHierarchyData] = useState<HierarchyData>(data);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [parentForNew, setParentForNew] = useState<HierarchyData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const expandAll = (node: HierarchyData): Set<string> => {
      const expanded = new Set<string>();
      expanded.add(node.id);
      if (node.children) {
        node.children.forEach((child) => {
          expandAll(child).forEach((id) => expanded.add(id));
        });
      }
      return expanded;
    };
    setExpandedNodes(expandAll(data));
  }, [data]);

  const handleSave = () => {
    if (onSave) onSave(hierarchyData);
  };

  const handleAddNode = (parentNode: HierarchyData) => {
    setParentForNew(parentNode);
    setNewNodeName("");
    setIsAdding(true);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const handleAddSubmit = () => {
    if (!parentForNew || !newNodeName.trim()) {
      setIsAdding(false);
      setParentForNew(null);
      return;
    }

    const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const newNode: HierarchyData = {
      id: newNodeId,
      name: newNodeName.trim(),
      level: parentForNew.level + 1,
      children: [],
    };

    const updateTree = (node: HierarchyData): HierarchyData => {
      if (node.id === parentForNew.id) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateTree),
        };
      }
      return node;
    };

    setHierarchyData(updateTree(hierarchyData));
    setExpandedNodes((prev) => new Set(prev).add(parentForNew.id));
    setIsAdding(false);
    setParentForNew(null);
    setSelectedNodeId(newNodeId);
  };

  const handleEditNode = (node: HierarchyData) => {
    setEditNode(node);
    setEditValue(node.name);
    setIsEditing(true);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 50);
  };

  const handleEditSubmit = () => {
    if (!editNode || !editValue.trim()) return;

    const updateTree = (node: HierarchyData): HierarchyData => {
      if (node.id === editNode.id) {
        return { ...node, name: editValue.trim() };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateTree),
        };
      }
      return node;
    };

    setHierarchyData(updateTree(hierarchyData));
    setIsEditing(false);
    setEditNode(null);
    setEditValue("");
  };

  const handleDeleteNode = (node: HierarchyData) => {
    if (node.id === "root") {
      alert("Нельзя удалить корневой узел");
      return;
    }

    const deleteFromTree = (
      currentNode: HierarchyData,
    ): HierarchyData | null => {
      if (currentNode.children) {
        const filteredChildren = currentNode.children
          .map(deleteFromTree)
          .filter((child): child is HierarchyData => child !== null);

        if (currentNode.children.some((child) => child.id === node.id)) {
          return {
            ...currentNode,
            children: filteredChildren,
          };
        }
        return {
          ...currentNode,
          children: filteredChildren,
        };
      }
      return currentNode;
    };

    const newTree = deleteFromTree(hierarchyData);
    if (newTree) {
      setHierarchyData(newTree);
    }
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
    }
  };

  const downloadPNG = async () => {
    if (!containerRef.current) return;

    try {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const canvas = await html2canvas(containerRef.current);

      window.scrollTo(scrollX, scrollY);

      const link = document.createElement("a");
      link.download = "hierarchy.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
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

  const expandAll = () => {
    const expandAllNodes = (node: HierarchyData): Set<string> => {
      const expanded = new Set<string>();
      expanded.add(node.id);
      if (node.children) {
        node.children.forEach((child) => {
          expandAllNodes(child).forEach((id) => expanded.add(id));
        });
      }
      return expanded;
    };
    setExpandedNodes(expandAllNodes(hierarchyData));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set([hierarchyData.id]));
  };

  useEffect(() => {
    setHierarchyData(data);
  }, [data]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const countNodes = (node: HierarchyData): number => {
    let count = 1;
    if (node.children) {
      node.children.forEach((child) => {
        count += countNodes(child);
      });
    }
    return count;
  };

  const totalNodes = countNodes(hierarchyData);

  return (
    <div ref={containerRef} className="hierarchy-container">
      <div className="hierarchy-toolbar">
        <button
          onClick={expandAll}
          className="hierarchy-toolbar-btn"
          title="Развернуть всё"
        >
          <FolderTree size={16} />
          <span>Развернуть</span>
        </button>
        <button
          onClick={collapseAll}
          className="hierarchy-toolbar-btn"
          title="Свернуть всё"
        >
          <FolderTree size={16} />
          <span>Свернуть</span>
        </button>
        <div className="hierarchy-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="hierarchy-toolbar-btn"
          title="Скачать PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="hierarchy-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="hierarchy-toolbar-divider" />
            <button
              onClick={handleSave}
              className="hierarchy-toolbar-btn primary"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="hierarchy-stats">
        <span>
          <FolderTree size={14} /> Всего узлов: {totalNodes}
        </span>
        <span>Градиентная цветовая схема</span>
      </div>

      <div className="hierarchy-tree-container" ref={treeContainerRef}>
        <TreeNode
          node={hierarchyData}
          level={0}
          onEdit={handleEditNode}
          onDelete={handleDeleteNode}
          onAdd={handleAddNode}
          selectedId={selectedNodeId}
          onSelect={setSelectedNodeId}
          expandedNodes={expandedNodes}
          onToggleExpand={(nodeId) => {
            setExpandedNodes((prev) => {
              const next = new Set(prev);
              if (next.has(nodeId)) {
                next.delete(nodeId);
              } else {
                next.add(nodeId);
              }
              return next;
            });
          }}
        />
      </div>

      <div className="hierarchy-info-panel">
        <span>
          Клик на узел - выделить | Редактирование - иконка карандаша |
          Добавление - иконка плюса | Удаление - иконка корзины
        </span>
      </div>

      {isEditing && editNode && (
        <div className="hierarchy-edit-modal">
          <div className="hierarchy-edit-modal-content">
            <h3>Редактировать название</h3>
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="hierarchy-edit-modal-input"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
            />
            <div className="hierarchy-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="hierarchy-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="hierarchy-edit-modal-btn save"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && parentForNew && (
        <div className="hierarchy-edit-modal">
          <div className="hierarchy-edit-modal-content">
            <h3>Добавить потомка для &quot;{parentForNew.name}&quot;</h3>
            <input
              ref={editInputRef}
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              className="hierarchy-edit-modal-input"
              placeholder="Название узла"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddSubmit()}
            />
            <div className="hierarchy-edit-modal-actions">
              <button
                onClick={() => setIsAdding(false)}
                className="hierarchy-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleAddSubmit}
                className="hierarchy-edit-modal-btn save"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const HierarchyViewer = (props: HierarchyViewerProps) => {
  return <HierarchyViewerContent {...props} />;
};
