import { RoadmapToolbar } from "./RoadmapToolbar";
import { TimelineView } from "./TimelineView";
import { GanttView } from "./GanttView";
import { CardsView } from "./CardsView";
import { HelpGuide } from "./HelpGuide";
import { EditModal } from "./EditModal";
import { useRoadmapViewer } from "../../hooks/useRoadmapViewer";
import { Eye, Rocket } from "lucide-react";
import { RoadmapData } from "../../types";
import "../../styles/roadmap-viewer.css";

interface RoadmapViewerProps {
  data: RoadmapData;
  onClose?: () => void;
  onSave?: (data: RoadmapData) => void;
  isSaving?: boolean;
}

export const RoadmapViewer = ({
  data,
  onSave,
  isSaving,
}: RoadmapViewerProps) => {
  const {
    containerRef,
    isFullscreen,
    isEditing,
    editMode,
    editValue,
    chartData,
    selectedPhase,
    viewMode,
    showHelp,
    handleSave,
    handleAddPhase,
    handleAddTask,
    handleDeletePhase,
    handleDeleteTask,
    handleToggleTask,
    handleEditPhaseName,
    handleEditTask,
    handleEditDuration,
    handleEditSubmit,
    setEditValue,
    setIsEditing,
    setViewMode,
    setShowHelp,
    setSelectedPhase,
    getTotalProgress,
    getPhaseProgress,
    getGanttWidth,
    getGanttPosition,
  } = useRoadmapViewer({ data, onSave });

  return (
    <div ref={containerRef} className="roadmap-container">
      <RoadmapToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddPhase={handleAddPhase}
        onDownloadJSON={() => {
          const jsonStr = JSON.stringify(chartData, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = "roadmap.json";
          link.click();
          URL.revokeObjectURL(url);
        }}
        onToggleFullscreen={() => {
          if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
        }}
        isFullscreen={isFullscreen}
        onShowHelp={() => setShowHelp(true)}
        onSave={handleSave}
        isSaving={isSaving}
        onSaveAvailable={!!onSave}
      />

      <div className="roadmap-visualization-area">
        {viewMode === "timeline" && (
          <TimelineView
            phases={chartData.phases}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            onEditPhaseName={handleEditPhaseName}
            onDeletePhase={handleDeletePhase}
            onEditDuration={handleEditDuration}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            getPhaseProgress={getPhaseProgress}
          />
        )}
        {viewMode === "gantt" && (
          <GanttView
            phases={chartData.phases}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            onEditPhaseName={handleEditPhaseName}
            onDeletePhase={handleDeletePhase}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            getGanttWidth={getGanttWidth}
            getGanttPosition={getGanttPosition}
          />
        )}
        {viewMode === "cards" && (
          <CardsView
            phases={chartData.phases}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            onEditPhaseName={handleEditPhaseName}
            onDeletePhase={handleDeletePhase}
            onEditDuration={handleEditDuration}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            totalPhases={chartData.phases.length}
            totalTasks={chartData.phases.reduce(
              (s, p) => s + p.tasks.length,
              0,
            )}
            totalProgress={getTotalProgress()}
          />
        )}
      </div>

      <div className="roadmap-status-bar">
        <div className="status-item">
          <Eye size={14} /> Выбрано:{" "}
          {selectedPhase !== null
            ? chartData.phases[selectedPhase]?.name
            : "нет"}
        </div>
        <div className="status-item">
          <Rocket size={14} /> Прогресс: {getTotalProgress()}%
        </div>
      </div>

      <EditModal
        isOpen={isEditing}
        mode={editMode}
        value={editValue}
        onValueChange={setEditValue}
        onClose={() => setIsEditing(false)}
        onSubmit={handleEditSubmit}
      />

      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
    </div>
  );
};
