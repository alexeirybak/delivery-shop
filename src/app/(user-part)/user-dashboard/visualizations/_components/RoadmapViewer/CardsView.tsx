import { TrendingUp, CheckCircle, Zap, Edit2, Clock, Trash2, Calendar, Plus } from "lucide-react";
import { RoadmapPhase } from "../../types/visualizations.types";
import { markerColors } from "../../utils/markerColors";

interface CardsViewProps {
  phases: RoadmapPhase[];
  selectedPhase: number | null;
  onSelectPhase: (index: number | null) => void;
  onEditPhaseName: (index: number) => void;
  onDeletePhase: (index: number) => void;
  onEditDuration: (index: number) => void;
  onEditTask: (phaseIndex: number, taskIndex: number) => void;
  onDeleteTask: (phaseIndex: number, taskIndex: number) => void;
  onToggleTask: (phaseIndex: number, taskIndex: number) => void;
  onAddTask: (phaseIndex: number) => void;
  totalPhases: number;
  totalTasks: number;
  totalProgress: number;
}

export const CardsView = ({
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
  totalPhases,
  totalTasks,
  totalProgress,
}: CardsViewProps) => {
  const getPhaseProgress = (phase: RoadmapPhase) => {
    if (phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / phase.tasks.length) * 100);
  };

  const getCompletedTasksCount = (phase: RoadmapPhase) => {
    return phase.tasks.filter((task) => task.completed).length;
  };

  return (
    <div className="cards-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div>
            <div className="stat-value">{totalPhases}</div>
            <div className="stat-label">Этапов</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <div>
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Всего задач</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Zap size={24} /></div>
          <div>
            <div className="stat-value">{totalProgress}%</div>
            <div className="stat-label">Общий прогресс</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className={`roadmap-card ${selectedPhase === idx ? "expanded" : ""}`}
            onClick={() => onSelectPhase(selectedPhase === idx ? null : idx)}
          >
            <div className="card-gradient" style={{ background: markerColors[idx % markerColors.length] }}></div>
            <div className="card-content">
              <div className="card-header">
                <h3>{phase.name}</h3>
                <div className="card-actions">
                  <button onClick={(e) => { e.stopPropagation(); onEditPhaseName(idx); }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onEditDuration(idx); }}>
                    <Clock size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeletePhase(idx); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="card-meta">
                <Calendar size={14} />
                {phase.duration || "Срок не указан"}
              </div>
              <div className="card-progress">
                <div className="card-progress-bar">
                  <div 
                    className="card-progress-fill" 
                    style={{ width: `${getPhaseProgress(phase)}%` }}
                  ></div>
                </div>
                <span className="card-progress-text">
                  {getCompletedTasksCount(phase)}/{phase.tasks.length} задач ({getPhaseProgress(phase)}%)
                </span>
              </div>
              <div className="card-tasks-list">
                {phase.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="card-task-item">
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
              <button onClick={(e) => { e.stopPropagation(); onAddTask(idx); }} className="add-task-button">
                <Plus size={14} /> Добавить задачу
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};