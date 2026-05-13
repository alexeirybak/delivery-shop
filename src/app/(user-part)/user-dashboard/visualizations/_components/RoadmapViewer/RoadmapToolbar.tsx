import {
  Plus,
  Download,
  Maximize2,
  HelpCircle,
  Save,
  Layers,
  GanttChart,
  Layout,
} from "lucide-react";

interface RoadmapToolbarProps {
  viewMode: "timeline" | "gantt" | "cards";
  setViewMode: (mode: "timeline" | "gantt" | "cards") => void;
  onAddPhase: () => void;
  onDownloadJSON: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onShowHelp: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  onSaveAvailable: boolean;
}

export const RoadmapToolbar = ({
  viewMode,
  setViewMode,
  onAddPhase,
  onDownloadJSON,
  onToggleFullscreen,
  isFullscreen,
  onShowHelp,
  onSave,
  isSaving,
  onSaveAvailable,
}: RoadmapToolbarProps) => {
  return (
    <div className="roadmap-toolbar">
      <div className="view-switcher">
        <button
          className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
          onClick={() => setViewMode("timeline")}
        >
          <Layers size={16} /> Timeline
        </button>
        <button
          className={`view-btn ${viewMode === "gantt" ? "active" : ""}`}
          onClick={() => setViewMode("gantt")}
        >
          <GanttChart size={16} /> Gantt
        </button>
        <button
          className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
          onClick={() => setViewMode("cards")}
        >
          <Layout size={16} /> Cards
        </button>
      </div>
      <div className="toolbar-actions">
        <button onClick={onAddPhase} className="toolbar-btn primary">
          <Plus size={16} /> Этап
        </button>
        <button onClick={onDownloadJSON} className="toolbar-btn">
          <Download size={16} /> JSON
        </button>
        <button onClick={onToggleFullscreen} className="toolbar-btn">
          <Maximize2 size={16} /> {isFullscreen ? "Окно" : "Экран"}
        </button>
        <button onClick={onShowHelp} className="toolbar-btn">
          <HelpCircle size={16} /> Помощь
        </button>
        {onSaveAvailable && (
          <button
            onClick={onSave}
            className="toolbar-btn success"
            disabled={isSaving}
          >
            <Save size={16} /> {isSaving ? "..." : "Сохранить"}
          </button>
        )}
      </div>
    </div>
  );
};
