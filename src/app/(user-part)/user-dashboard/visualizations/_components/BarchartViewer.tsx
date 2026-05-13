import { useEffect, useRef, useState } from "react";
import {
  Download,
  Maximize2,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartData as ChartDataType } from "../types/visualizations.types";
import { generateChartColors } from "../utils/generateChartColors";
import "../styles/barchart-viewer.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarchartViewerProps {
  data: ChartDataType;
  onClose?: () => void;
  onSave?: (data: ChartDataType) => void;
  isSaving?: boolean;
}

function BarchartViewerContent({
  data,
  onSave,
  isSaving,
}: BarchartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"label" | "data" | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDatasetIndex, setEditDatasetIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartDataType>(data);

  const getChartJsData = (): ChartData<"bar"> => {
    const datasets = chartData.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor:
        dataset.backgroundColor || generateChartColors(chartData.labels.length),
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 4,
    }));

    return {
      labels: chartData.labels,
      datasets,
    };
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#64748b", 
          font: { size: 12 },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#334155",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#475569",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#cbd5e1",
          display: false,
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
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        setEditMode("data");
        setEditIndex(element.index);
        setEditDatasetIndex(element.datasetIndex);
        setEditValue(
          String(chartData.datasets[element.datasetIndex].data[element.index]),
        );
        setIsEditing(true);
      }
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
      backgroundColor: generateChartColors(chartData.labels.length),
    };
    setChartData({
      ...chartData,
      datasets: [...chartData.datasets, newDataset],
    });
  };

  const handleAddBar = () => {
    const newLabel = `Категория ${chartData.labels.length + 1}`;
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

  const handleDeleteBar = (index: number) => {
    if (chartData.labels.length <= 1) {
      alert("Должен быть хотя бы один столбец");
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

  const handleEditSubmit = () => {
    if (
      editMode === "data" &&
      editIndex !== null &&
      editDatasetIndex !== null
    ) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue)) {
        const newDatasets = [...chartData.datasets];
        newDatasets[editDatasetIndex].data[editIndex] = newValue;
        setChartData({ ...chartData, datasets: newDatasets });
      }
    }
    setIsEditing(false);
    setEditMode(null);
    setEditIndex(null);
    setEditDatasetIndex(null);
    setEditValue("");
  };

  const handleLabelEdit = (index: number) => {
    setEditMode("label");
    setEditIndex(index);
    setEditValue(chartData.labels[index]);
    setIsEditing(true);
  };

  const handleLabelEditSubmit = () => {
    if (editMode === "label" && editIndex !== null && editValue.trim()) {
      const newLabels = [...chartData.labels];
      newLabels[editIndex] = editValue.trim();
      setChartData({ ...chartData, labels: newLabels });
    }
    setIsEditing(false);
    setEditMode(null);
    setEditIndex(null);
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
      link.download = "barchart.png";
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

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.update();
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
    <div ref={containerRef} className="barchart-container">
      <div className="barchart-toolbar">
        <button
          onClick={resetZoom}
          className="barchart-toolbar-btn"
          title="Сбросить зум"
        >
          <RefreshCw size={16} />
          <span>Сброс</span>
        </button>
        <div className="barchart-toolbar-divider" />
        <button
          onClick={handleAddBar}
          className="barchart-toolbar-btn"
          title="Добавить столбец"
        >
          <Plus size={16} />
          <span>Столбец</span>
        </button>
        <button
          onClick={handleAddDataset}
          className="barchart-toolbar-btn"
          title="Добавить набор данных"
        >
          <Plus size={16} />
          <span>Набор</span>
        </button>
        <div className="barchart-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="barchart-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="barchart-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="barchart-toolbar-divider" />
            <button
              onClick={handleSave}
              className="barchart-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="barchart-data-panel">
        <div className="barchart-labels">
          <h4>Категории:</h4>
          <div className="barchart-labels-list">
            {chartData.labels.map((label, index) => (
              <div key={index} className="barchart-label-item">
                <span>{label}</span>
                <div className="barchart-label-actions">
                  <button
                    onClick={() => handleLabelEdit(index)}
                    className="barchart-label-edit"
                    title="Редактировать"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteBar(index)}
                    className="barchart-label-delete"
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="barchart-datasets">
          <h4>Наборы данных:</h4>
          <div className="barchart-datasets-list">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="barchart-dataset-item">
                <span
                  style={{
                    background: Array.isArray(dataset.backgroundColor)
                      ? dataset.backgroundColor[0]
                      : dataset.backgroundColor,
                  }}
                  className="barchart-dataset-color"
                />
                <span className="barchart-dataset-label">{dataset.label}</span>
                <div className="barchart-dataset-actions">
                  <button
                    onClick={() => handleDatasetLabelEdit(index)}
                    className="barchart-dataset-edit"
                    title="Редактировать"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteDataset(index)}
                    className="barchart-dataset-delete"
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="barchart-chart-wrapper">
        <Bar ref={chartRef} data={getChartJsData()} options={options} />
      </div>

      {isEditing && (
        <div className="edit-modal">
          <p className="edit-modal-title">
            {editMode === "label"
              ? "Редактировать категорию"
              : "Редактировать значение"}
          </p>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="edit-modal-input"
            autoFocus
          />
          <div className="edit-modal-actions">
            <button
              onClick={() => setIsEditing(false)}
              className="edit-modal-btn cancel"
            >
              Отмена
            </button>
            <button
              onClick={
                editMode === "label" ? handleLabelEditSubmit : handleEditSubmit
              }
              className="edit-modal-btn save"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      <div className="barchart-info-panel">
        Клик по столбцу - редактировать значение
      </div>
    </div>
  );
}

export const BarchartViewer = (props: BarchartViewerProps) => {
  return <BarchartViewerContent {...props} />;
};