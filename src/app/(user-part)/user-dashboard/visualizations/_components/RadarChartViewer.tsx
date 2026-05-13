"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Download,
  Maximize2,
  Save,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { RadarChartData } from "../types/visualizations.types";
import { generateChartColors } from "../utils/generateChartColors";
import "../styles/radar-chart-viewer.css";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface RadarChartViewerProps {
  data: RadarChartData;
  onClose?: () => void;
  onSave?: (data: RadarChartData) => void;
  isSaving?: boolean;
}

const generateBorderColors = (colors: string[]): string[] => {
  return colors.map((color) => color.replace("0.7", "1"));
};

function RadarChartViewerContent({
  data,
  onSave,
  isSaving,
}: RadarChartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"radar">>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"label" | "data">("label");
  const [editDatasetIndex, setEditDatasetIndex] = useState<number | null>(null);
  const [editAxisIndex, setEditAxisIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [chartData, setChartData] = useState<RadarChartData>(data);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (chartData.datasets.length > 0) {
      const colors = generateChartColors(chartData.datasets.length);
      const rgbaColors = colors.map((color) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      });
      setSelectedColors(rgbaColors);
    }
  }, [chartData.datasets.length]);

  const getChartJsData = useCallback(() => {
    const datasets = chartData.datasets.map((dataset, idx) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: selectedColors[idx] || "rgba(109, 241, 255, 0.2)",
      borderColor: generateBorderColors([
        selectedColors[idx] || "rgba(109, 241, 255, 0.7)",
      ])[0],
      borderWidth: 2,
      pointBackgroundColor: generateBorderColors([
        selectedColors[idx] || "rgba(109, 241, 255, 0.7)",
      ])[0],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: generateBorderColors([
        selectedColors[idx] || "rgba(109, 241, 255, 0.7)",
      ])[0],
      fill: true,
    }));

    return {
      labels: chartData.labels,
      datasets,
    };
  }, [chartData, selectedColors]);

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#64748b",
          font: { size: 12 },
          padding: 14,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#334155",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#475569",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#64748b",
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(100, 116, 139, 0.2)",
        },
        angleLines: {
          color: "rgba(100, 116, 139, 0.2)",
        },
        pointLabels: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(chartData);
    }
  }, [chartData, onSave]);

  const handleAddDataset = useCallback(() => {
    const newDataset = {
      label: `Набор ${chartData.datasets.length + 1}`,
      data: chartData.labels.map(() => Math.floor(Math.random() * 100)),
    };
    setChartData({
      ...chartData,
      datasets: [...chartData.datasets, newDataset],
    });
  }, [chartData]);

  const handleAddAxis = useCallback(() => {
    const newLabel = `Ось ${chartData.labels.length + 1}`;
    setChartData({
      labels: [...chartData.labels, newLabel],
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, Math.floor(Math.random() * 100)],
      })),
    });
  }, [chartData]);

  const handleDeleteDataset = useCallback(
    (index: number) => {
      if (chartData.datasets.length <= 1) {
        alert("Должен быть хотя бы один набор данных");
        return;
      }
      setChartData({
        ...chartData,
        datasets: chartData.datasets.filter((_, i) => i !== index),
      });
    },
    [chartData],
  );

  const handleDeleteAxis = useCallback(
    (index: number) => {
      if (chartData.labels.length <= 1) {
        alert("Должна быть хотя бы одна ось");
        return;
      }
      setChartData({
        labels: chartData.labels.filter((_, i) => i !== index),
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.filter((_, i) => i !== index),
        })),
      });
    },
    [chartData],
  );

  const handleEditAxisLabel = useCallback(
    (index: number) => {
      setEditMode("label");
      setEditAxisIndex(index);
      setEditValue(chartData.labels[index]);
      setIsEditing(true);
    },
    [chartData.labels],
  );

  const handleEditDataValue = useCallback(
    (datasetIndex: number, axisIndex: number) => {
      setEditMode("data");
      setEditDatasetIndex(datasetIndex);
      setEditAxisIndex(axisIndex);
      setEditValue(String(chartData.datasets[datasetIndex].data[axisIndex]));
      setIsEditing(true);
    },
    [chartData.datasets],
  );

  const handleEditSubmit = useCallback(() => {
    if (editMode === "label" && editAxisIndex !== null && editValue.trim()) {
      const newLabels = [...chartData.labels];
      newLabels[editAxisIndex] = editValue.trim();
      setChartData({ ...chartData, labels: newLabels });
    } else if (
      editMode === "data" &&
      editDatasetIndex !== null &&
      editAxisIndex !== null
    ) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
        const newDatasets = [...chartData.datasets];
        newDatasets[editDatasetIndex].data[editAxisIndex] = newValue;
        setChartData({ ...chartData, datasets: newDatasets });
      } else {
        alert("Значение должно быть числом от 0 до 100");
      }
    }
    setIsEditing(false);
    setEditMode("label");
    setEditDatasetIndex(null);
    setEditAxisIndex(null);
    setEditValue("");
  }, [editMode, editAxisIndex, editDatasetIndex, editValue, chartData]);

  const handleDatasetLabelEdit = useCallback(
    (index: number) => {
      const newLabel = prompt(
        "Введите новое название набора данных:",
        chartData.datasets[index].label,
      );
      if (newLabel && newLabel.trim()) {
        const newDatasets = [...chartData.datasets];
        newDatasets[index].label = newLabel.trim();
        setChartData({ ...chartData, datasets: newDatasets });
      }
    },
    [chartData],
  );

  const downloadPNG = useCallback(async () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement("a");
      link.download = "radarchart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="radar-chart-container">
      <div className="radar-chart-toolbar">
        <div className="radar-chart-toolbar-divider" />
        <button
          onClick={handleAddAxis}
          className="radar-chart-toolbar-btn"
          title="Добавить ось"
        >
          <Plus size={16} />
          <span>Ось</span>
        </button>
        <button
          onClick={handleAddDataset}
          className="radar-chart-toolbar-btn"
          title="Добавить набор данных"
        >
          <Plus size={16} />
          <span>Набор</span>
        </button>
        <div className="radar-chart-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="radar-chart-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="radar-chart-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="radar-chart-toolbar-divider" />
            <button
              onClick={handleSave}
              className="radar-chart-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="radar-chart-data-panel">
        <div className="radar-chart-axes">
          <h4>Оси (показатели):</h4>
          <div className="radar-chart-axes-list">
            {chartData.labels.map((label, index) => (
              <div key={index} className="radar-chart-axis-item">
                <span className="radar-chart-axis-name">{label}</span>
                <div className="radar-chart-axis-actions">
                  <button
                    onClick={() => handleEditAxisLabel(index)}
                    className="radar-chart-axis-edit"
                    title="Редактировать"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteAxis(index)}
                    className="radar-chart-axis-delete"
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="radar-chart-datasets">
          <h4>Наборы данных:</h4>
          <div className="radar-chart-datasets-list">
            {chartData.datasets.map((dataset, datasetIndex) => (
              <div key={datasetIndex} className="radar-chart-dataset-item">
                <div
                  className="radar-chart-dataset-color"
                  style={{
                    background: selectedColors[datasetIndex] || "#6df1ff",
                  }}
                />
                <span className="radar-chart-dataset-label">
                  {dataset.label}
                </span>
                <div className="radar-chart-dataset-actions">
                  <button
                    onClick={() => handleDatasetLabelEdit(datasetIndex)}
                    className="radar-chart-dataset-edit"
                    title="Редактировать название"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteDataset(datasetIndex)}
                    className="radar-chart-dataset-delete"
                    title="Удалить набор"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="radar-chart-values-panel">
        <h4>Значения:</h4>
        <div className="radar-chart-values-table">
          <table className="radar-chart-values-table-content">
            <thead>
              <tr>
                <th>Ось / Набор</th>
                {chartData.datasets.map((dataset, idx) => (
                  <th key={idx}>{dataset.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, axisIndex) => (
                <tr key={axisIndex}>
                  <td className="radar-chart-values-axis">{label}</td>
                  {chartData.datasets.map((dataset, datasetIndex) => (
                    <td
                      key={datasetIndex}
                      className="radar-chart-values-cell"
                      onClick={() =>
                        handleEditDataValue(datasetIndex, axisIndex)
                      }
                    >
                      {dataset.data[axisIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="radar-chart-values-hint">
          Кликните на значение в таблице для редактирования
        </p>
      </div>

      <div className="radar-chart-wrapper">
        <Radar ref={chartRef} data={getChartJsData()} options={options} />
      </div>

      {isEditing && (
        <div className="radar-chart-edit-modal">
          <div className="radar-chart-edit-modal-content">
            <h3 className="radar-chart-edit-modal-title">
              {editMode === "label"
                ? "Редактировать название оси"
                : "Редактировать значение"}
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="radar-chart-edit-modal-input"
              autoFocus
              placeholder={
                editMode === "label" ? "Название оси" : "Значение (0-100)"
              }
            />
            <div className="radar-chart-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="radar-chart-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="radar-chart-edit-modal-btn save"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const RadarChartViewer = (props: RadarChartViewerProps) => {
  return <RadarChartViewerContent {...props} />;
};
