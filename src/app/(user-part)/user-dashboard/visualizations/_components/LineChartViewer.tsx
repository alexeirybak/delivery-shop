"use client";

import { useEffect, useRef, useState } from "react";
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChartData } from "../types/visualizations.types";
import { generateChartColors } from "../utils/generateChartColors";
import "../styles/linechart-viewer.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface LineChartViewerProps {
  data: LineChartData;
  onClose?: () => void;
  onSave?: (data: LineChartData) => void;
  isSaving?: boolean;
}

function LineChartViewerContent({
  data,
  onSave,
  isSaving,
}: LineChartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"line">>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"label" | "data">("label");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDatasetIndex, setEditDatasetIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [chartData, setChartData] = useState<LineChartData>(data);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (chartData.datasets.length > 0) {
      const colors = generateChartColors(chartData.datasets.length);
      setSelectedColors(colors);
    }
  }, [chartData.datasets.length]);

  const getChartJsData = (): ChartData<"line"> => {
    const datasets = chartData.datasets.map((dataset, idx) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: selectedColors[idx] || "#6df1ff",
      backgroundColor: "transparent",
      borderWidth: 2,
      pointBackgroundColor: selectedColors[idx] || "#6df1ff",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: false,
    }));

    return {
      labels: chartData.labels,
      datasets,
    };
  };

  const options: ChartOptions<"line"> = {
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
      x: {
        grid: {
          color: "#cbd5e1",
          display: true,
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: "#cbd5e1",
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
        beginAtZero: true,
      },
    },
  };

  const handleSave = () => {
    if (onSave) {
      onSave(chartData);
    }
  };

  const handleAddDataset = () => {
    const newDataset = {
      label: `Набор ${chartData.datasets.length + 1}`,
      data: chartData.labels.map(() => Math.floor(Math.random() * 100)),
    };
    setChartData({
      ...chartData,
      datasets: [...chartData.datasets, newDataset],
    });
  };

  const handleAddPoint = () => {
    const newLabel = `Точка ${chartData.labels.length + 1}`;
    setChartData({
      labels: [...chartData.labels, newLabel],
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, Math.floor(Math.random() * 100)],
      })),
    });
  };

  const handleDeleteDataset = (index: number) => {
    if (chartData.datasets.length <= 1) {
      alert("Должен быть хотя бы один набор данных");
      return;
    }
    setChartData({
      ...chartData,
      datasets: chartData.datasets.filter((_, i) => i !== index),
    });
  };

  const handleDeletePoint = (index: number) => {
    if (chartData.labels.length <= 1) {
      alert("Должна быть хотя бы одна точка");
      return;
    }
    setChartData({
      labels: chartData.labels.filter((_, i) => i !== index),
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.filter((_, i) => i !== index),
      })),
    });
  };

  const handleEditLabel = (index: number) => {
    setEditMode("label");
    setEditIndex(index);
    setEditValue(chartData.labels[index]);
    setIsEditing(true);
  };

  const handleEditDataValue = (datasetIndex: number, pointIndex: number) => {
    setEditMode("data");
    setEditDatasetIndex(datasetIndex);
    setEditIndex(pointIndex);
    setEditValue(String(chartData.datasets[datasetIndex].data[pointIndex]));
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editMode === "label" && editIndex !== null && editValue.trim()) {
      const newLabels = [...chartData.labels];
      newLabels[editIndex] = editValue.trim();
      setChartData({ ...chartData, labels: newLabels });
    } else if (
      editMode === "data" &&
      editDatasetIndex !== null &&
      editIndex !== null
    ) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue >= 0) {
        const newDatasets = [...chartData.datasets];
        newDatasets[editDatasetIndex].data[editIndex] = newValue;
        setChartData({ ...chartData, datasets: newDatasets });
      } else {
        alert("Значение должно быть положительным числом");
      }
    }
    setIsEditing(false);
    setEditMode("label");
    setEditIndex(null);
    setEditDatasetIndex(null);
    setEditValue("");
  };

  const handleDatasetLabelEdit = (index: number) => {
    const newLabel = prompt(
      "Введите новое название набора данных:",
      chartData.datasets[index].label,
    );
    if (newLabel && newLabel.trim()) {
      const newDatasets = [...chartData.datasets];
      newDatasets[index].label = newLabel.trim();
      setChartData({ ...chartData, datasets: newDatasets });
    }
  };

  const downloadPNG = async () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement("a");
      link.download = "linechart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
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
    <div ref={containerRef} className="linechart-container">
      <div className="linechart-toolbar">
        <div className="linechart-toolbar-divider" />
        <button
          onClick={handleAddPoint}
          className="linechart-toolbar-btn"
          title="Добавить точку"
        >
          <Plus size={16} />
          <span>Точка</span>
        </button>
        <button
          onClick={handleAddDataset}
          className="linechart-toolbar-btn"
          title="Добавить набор данных"
        >
          <Plus size={16} />
          <span>Набор</span>
        </button>
        <div className="linechart-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="linechart-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="linechart-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="linechart-toolbar-divider" />
            <button
              onClick={handleSave}
              className="linechart-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="linechart-data-panel">
        <div className="linechart-labels">
          <h4>Точки (ось X):</h4>
          <div className="linechart-labels-list">
            {chartData.labels.map((label, index) => (
              <div key={index} className="linechart-label-item">
                <span className="linechart-label-name">{label}</span>
                <div className="linechart-label-actions">
                  <button
                    onClick={() => handleEditLabel(index)}
                    className="linechart-label-edit"
                    title="Редактировать"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeletePoint(index)}
                    className="linechart-label-delete"
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="linechart-datasets">
          <h4>Наборы данных:</h4>
          <div className="linechart-datasets-list">
            {chartData.datasets.map((dataset, datasetIndex) => (
              <div key={datasetIndex} className="linechart-dataset-item">
                <div
                  className="linechart-dataset-color"
                  style={{
                    background: selectedColors[datasetIndex] || "#6df1ff",
                  }}
                />
                <span className="linechart-dataset-label">{dataset.label}</span>
                <div className="linechart-dataset-actions">
                  <button
                    onClick={() => handleDatasetLabelEdit(datasetIndex)}
                    className="linechart-dataset-edit"
                    title="Редактировать название"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteDataset(datasetIndex)}
                    className="linechart-dataset-delete"
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

      <div className="linechart-values-panel">
        <h4>Значения:</h4>
        <div className="linechart-values-table">
          <table className="linechart-values-table-content">
            <thead>
              <tr>
                <th>Точка / Набор</th>
                {chartData.datasets.map((dataset, idx) => (
                  <th key={idx}>{dataset.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, pointIndex) => (
                <tr key={pointIndex}>
                  <td className="linechart-values-point">{label}</td>
                  {chartData.datasets.map((dataset, datasetIndex) => (
                    <td
                      key={datasetIndex}
                      className="linechart-values-cell"
                      onClick={() =>
                        handleEditDataValue(datasetIndex, pointIndex)
                      }
                    >
                      {dataset.data[pointIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="linechart-values-hint">
          Кликните на значение в таблице для редактирования
        </p>
      </div>

      <div className="linechart-chart-wrapper">
        <Line ref={chartRef} data={getChartJsData()} options={options} />
      </div>

      {isEditing && (
        <div className="linechart-edit-modal">
          <div className="linechart-edit-modal-content">
            <h3 className="linechart-edit-modal-title">
              {editMode === "label"
                ? "Редактировать название точки"
                : "Редактировать значение"}
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="linechart-edit-modal-input"
              autoFocus
              placeholder={editMode === "label" ? "Название точки" : "Значение"}
            />
            <div className="linechart-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="linechart-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="linechart-edit-modal-btn save"
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

export const LineChartViewer = (props: LineChartViewerProps) => {
  return <LineChartViewerContent {...props} />;
};
