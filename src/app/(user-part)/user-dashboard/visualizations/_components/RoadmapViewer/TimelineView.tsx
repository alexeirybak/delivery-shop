import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flag, Edit2, Trash2, Clock, Plus } from "lucide-react";
import { RoadmapPhase } from "../../types/visualizations.types";
import { markerColors } from "../../utils/markerColors";

interface TimelineViewProps {
  phases: RoadmapPhase[];
  selectedPhase: number | null;
  onSelectPhase: (index: number) => void;
  onEditPhaseName: (index: number) => void;
  onDeletePhase: (index: number) => void;
  onEditDuration: (index: number) => void;
  onEditTask: (phaseIndex: number, taskIndex: number) => void;
  onDeleteTask: (phaseIndex: number, taskIndex: number) => void;
  onToggleTask: (phaseIndex: number, taskIndex: number) => void;
  onAddTask: (phaseIndex: number) => void;
  getPhaseProgress: (phase: RoadmapPhase) => number;
}

export const TimelineView = ({
  phases,
  selectedPhase,
  onSelectPhase,
  onEditPhaseName,
  onDeletePhase,
  onEditDuration,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onAddTask,
  getPhaseProgress,
}: TimelineViewProps) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineContainerRef.current) {
      const scrollAmount = 300;
      timelineContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-controls">
        <button className="timeline-scroll-btn" onClick={() => scrollTimeline("left")} title="Назад">
          <ChevronLeft size={20} />
        </button>
        <button className="timeline-scroll-btn" onClick={() => scrollTimeline("right")} title="Вперед">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="timeline-phases-container" ref={timelineContainerRef}>
        <div className="timeline-track">
          <div className="timeline-line-horizontal"></div>
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className={`timeline-node ${selectedPhase === idx ? "active" : ""}`}
              onClick={() => onSelectPhase(idx)}
            >
              <div
                className="timeline-node-marker"
                style={{ background: markerColors[idx % markerColors.length] }}
              >
                <Flag size={16} />
              </div>
              <div className="timeline-node-content">
                <div className="timeline-node-header">
                  <h4>{phase.name}</h4>
                  <div className="timeline-node-actions">
                    <button onClick={(e) => { e.stopPropagation(); onEditPhaseName(idx); }} title="Редактировать">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeletePhase(idx); }} title="Удалить">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="timeline-node-duration">
                  <Clock size={12} />
                  <span>{phase.duration || "Не указан"}</span>
                  <button onClick={(e) => { e.stopPropagation(); onEditDuration(idx); }} title="Редактировать срок">
                    <Edit2 size={10} />
                  </button>
                </div>
                <div className="timeline-node-tasks">
                  {phase.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="timeline-task">
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
                      <button onClick={(e) => { e.stopPropagation(); onDeleteTask(idx, tIdx); }}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={(e) => { e.stopPropagation(); onAddTask(idx); }} className="timeline-add-task">
                  <Plus size={12} /> Добавить задачу
                </button>
                <div className="timeline-progress">
                  <div className="timeline-progress-bar">
                    <div className="timeline-progress-fill" style={{ width: `${getPhaseProgress(phase)}%` }}></div>
                  </div>
                  <span>{getPhaseProgress(phase)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};