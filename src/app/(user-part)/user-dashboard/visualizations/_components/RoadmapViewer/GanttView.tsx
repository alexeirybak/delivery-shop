import { Target, Edit2, Trash2, Plus } from "lucide-react";
import { RoadmapPhase } from "../../types/visualizations.types";
import { markerColors } from "../../utils/markerColors";

interface GanttViewProps {
  phases: RoadmapPhase[];
  selectedPhase: number | null;
  onSelectPhase: (index: number) => void;
  onEditPhaseName: (index: number) => void;
  onDeletePhase: (index: number) => void;
  onEditTask: (phaseIndex: number, taskIndex: number) => void;
  onDeleteTask: (phaseIndex: number, taskIndex: number) => void;
  onToggleTask: (phaseIndex: number, taskIndex: number) => void;
  onAddTask: (phaseIndex: number) => void;
  getGanttWidth: (phase: RoadmapPhase) => number;
  getGanttPosition: (index: number) => number;
}

export const GanttView = ({
  phases,
  selectedPhase,
  onSelectPhase,
  onEditPhaseName,
  onDeletePhase,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onAddTask,
  getGanttWidth,
}: GanttViewProps) => {
  const getPhaseProgress = (phase: RoadmapPhase) => {
    if (phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / phase.tasks.length) * 100);
  };

  return (
    <div className="gantt-view">
      <div className="gantt-header">
        <div className="gantt-phases-header">Этапы</div>
        <div className="gantt-timeline-header">
          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
            <div key={q} className="gantt-quarter">
              {q}
            </div>
          ))}
        </div>
      </div>
      <div className="gantt-body">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className={`gantt-row ${selectedPhase === idx ? "selected" : ""}`}
          >
            <div
              className="gantt-phase-name"
              onClick={() => onSelectPhase(idx)}
            >
              <Target size={16} />
              <span>{phase.name}</span>
              <div className="phase-duration-badge">{phase.duration}</div>
              <div className="phase-progress-badge">
                {getPhaseProgress(phase)}%
              </div>
              <div className="gantt-phase-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPhaseName(idx);
                  }}
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhase(idx);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <div className="gantt-bars">
              <div
                className="gantt-bar"
                style={{
                  width: `${getGanttWidth(phase)}%`,
                  background: markerColors[idx % markerColors.length],
                }}
              >
                <span>{getPhaseProgress(phase)}%</span>
              </div>
            </div>
            <div className="gantt-tasks-list">
              {phase.tasks.map((task, tIdx) => (
                <div key={tIdx} className="gantt-task-item">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(idx, tIdx)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    className={task.completed ? "completed" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(idx, tIdx);
                    }}
                  >
                    {task.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(idx, tIdx);
                    }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTask(idx);
                }}
                className="gantt-add-task"
              >
                <Plus size={10} /> Добавить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
