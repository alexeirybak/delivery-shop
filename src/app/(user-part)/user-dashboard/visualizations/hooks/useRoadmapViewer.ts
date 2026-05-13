import { useEffect, useRef, useState } from "react";
import {
  RoadmapData,
  RoadmapPhase,
  RoadmapTask,
} from "../types/visualizations.types";

interface UseRoadmapViewerProps {
  data: RoadmapData;
  onSave?: (data: RoadmapData) => void;
}

const convertToNewFormat = (data: RoadmapData): RoadmapData => {
  return {
    ...data,
    phases: data.phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((task): RoadmapTask => {
        if (typeof task !== "string") {
          return task;
        }
        return {
          name: task,
          completed: false,
        };
      }),
    })),
  };
};

export const useRoadmapViewer = ({ data, onSave }: UseRoadmapViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"phaseName" | "task" | "duration">(
    "phaseName",
  );
  const [editPhaseIndex, setEditPhaseIndex] = useState<number | null>(null);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [chartData, setChartData] = useState<RoadmapData>(() =>
    convertToNewFormat(data),
  );
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "gantt" | "cards">(
    "timeline",
  );
  const [showHelp, setShowHelp] = useState(false);

  const getPhaseProgress = (phase: RoadmapPhase): number => {
    if (phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / phase.tasks.length) * 100);
  };

  const getTotalProgress = (): number => {
    const allTasks = chartData.phases.flatMap((p) => p.tasks);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter((t) => t.completed).length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  const getGanttWidth = (phase: RoadmapPhase): number => {
    const progress = getPhaseProgress(phase);
    return Math.max(6, Math.min(95, progress));
  };
  const getGanttPosition = (index: number): number => {
    return (index * 8) % 50;
  };

  const handleSave = () => {
    if (onSave) onSave(chartData);
  };

  const handleAddPhase = () => {
    const newPhase: RoadmapPhase = {
      name: `Этап ${chartData.phases.length + 1}`,
      tasks: [{ name: "Новая задача", completed: false }],
      duration: "2 недели",
    };
    setChartData({ ...chartData, phases: [...chartData.phases, newPhase] });
  };

  const handleAddTask = (phaseIndex: number) => {
    const newPhases = [...chartData.phases];
    newPhases[phaseIndex].tasks.push({
      name: "Новая задача",
      completed: false,
    });
    setChartData({ ...chartData, phases: newPhases });
  };

  const handleDeletePhase = (phaseIndex: number) => {
    if (chartData.phases.length <= 1) {
      alert("Должен быть хотя бы один этап");
      return;
    }
    setChartData({
      ...chartData,
      phases: chartData.phases.filter((_, i) => i !== phaseIndex),
    });
    setSelectedPhase(null);
  };

  const handleDeleteTask = (phaseIndex: number, taskIndex: number) => {
    const newPhases = [...chartData.phases];
    newPhases[phaseIndex].tasks = newPhases[phaseIndex].tasks.filter(
      (_, i) => i !== taskIndex,
    );
    setChartData({ ...chartData, phases: newPhases });
  };

  const handleToggleTask = (phaseIndex: number, taskIndex: number) => {
    const newPhases = [...chartData.phases];
    newPhases[phaseIndex].tasks[taskIndex].completed =
      !newPhases[phaseIndex].tasks[taskIndex].completed;
    setChartData({ ...chartData, phases: newPhases });
  };

  const handleEditPhaseName = (phaseIndex: number) => {
    setEditMode("phaseName");
    setEditPhaseIndex(phaseIndex);
    setEditValue(chartData.phases[phaseIndex].name);
    setIsEditing(true);
  };

  const handleEditTask = (phaseIndex: number, taskIndex: number) => {
    setEditMode("task");
    setEditPhaseIndex(phaseIndex);
    setEditTaskIndex(taskIndex);
    setEditValue(chartData.phases[phaseIndex].tasks[taskIndex].name);
    setIsEditing(true);
  };

  const handleEditDuration = (phaseIndex: number) => {
    setEditMode("duration");
    setEditPhaseIndex(phaseIndex);
    setEditValue(chartData.phases[phaseIndex].duration || "");
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (
      editMode === "phaseName" &&
      editPhaseIndex !== null &&
      editValue.trim()
    ) {
      const newPhases = [...chartData.phases];
      newPhases[editPhaseIndex].name = editValue.trim();
      setChartData({ ...chartData, phases: newPhases });
    } else if (
      editMode === "task" &&
      editPhaseIndex !== null &&
      editTaskIndex !== null &&
      editValue.trim()
    ) {
      const newPhases = [...chartData.phases];
      newPhases[editPhaseIndex].tasks[editTaskIndex].name = editValue.trim();
      setChartData({ ...chartData, phases: newPhases });
    } else if (
      editMode === "duration" &&
      editPhaseIndex !== null &&
      editValue.trim()
    ) {
      const newPhases = [...chartData.phases];
      newPhases[editPhaseIndex].duration = editValue.trim();
      setChartData({ ...chartData, phases: newPhases });
    }
    setIsEditing(false);
    setEditPhaseIndex(null);
    setEditTaskIndex(null);
    setEditValue("");
  };

  useEffect(() => {
    setChartData(convertToNewFormat(data));
  }, [data]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return {
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
  };
};
