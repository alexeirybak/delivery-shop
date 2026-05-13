import { useEffect, useRef, useState } from "react";
import {
  Download,
  Maximize2,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Edit2,
  PieChart,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { PieChartData } from "../types/visualizations.types";
import { generateChartColors } from "../utils/generateChartColors";
import "../styles/piechart-viewer.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartViewerProps {
  data: PieChartData;
  onClose?: () => void;
  onSave?: (data: PieChartData) => void;
  isSaving?: boolean;
}

function PieChartViewerContent({ data, onSave, isSaving }: PieChartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"pie">>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"name" | "value">("name");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [chartData, setChartData] = useState<PieChartData>(data);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (chartData.data.length > 0) {
      const newColors = generateChartColors(chartData.data.length);
      setSelectedColors(newColors);
    }
  }, [chartData.data.length]);

  const getChartJsData = () => {
    const labels = chartData.data.map((item) => item.name);
    const values = chartData.data.map((item) => item.value);
    const backgroundColors = chartData.data.map((_, idx) => 
      selectedColors[idx % selectedColors.length]
    );

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderColor: "var(--color-bg-0)",
          borderWidth: 2,
        },
      ],
    };
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#64748b", 
          font: { size: 12 },
          padding: 14,
          usePointStyle: true,
          pointStyle: "circle",
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
            const label = context.label || "";
            const value = context.raw as number;
            const total = chartData.data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const handleSave = () => {
    if (onSave) {
      onSave(chartData);
    }
  };

  const handleAddSector = () => {
    const newName = `Сектор ${chartData.data.length + 1}`;
    const newValue = 10;
    setChartData({
      data: [...chartData.data, { name: newName, value: newValue }],
    });
  };

  const handleDeleteSector = (index: number) => {
    if (chartData.data.length <= 1) {
      alert("Должен быть хотя бы один сектор");
      return;
    }
    setChartData({
      data: chartData.data.filter((_, i) => i !== index),
    });
  };

  const handleEditName = (index: number) => {
    setEditMode("name");
    setEditIndex(index);
    setEditValue(chartData.data[index].name);
    setIsEditing(true);
  };

  const handleEditValue = (index: number) => {
    setEditMode("value");
    setEditIndex(index);
    setEditValue(String(chartData.data[index].value));
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editIndex !== null) {
      if (editMode === "name" && editValue.trim()) {
        const newData = [...chartData.data];
        newData[editIndex] = { ...newData[editIndex], name: editValue.trim() };
        setChartData({ data: newData });
      } else if (editMode === "value") {
        const newValue = parseFloat(editValue);
        if (!isNaN(newValue) && newValue >= 0) {
          const newData = [...chartData.data];
          newData[editIndex] = { ...newData[editIndex], value: newValue };
          setChartData({ data: newData });
        }
      }
    }
    setIsEditing(false);
    setEditMode("name");
    setEditIndex(null);
    setEditValue("");
  };

  const downloadPNG = async () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement("a");
      link.download = "piechart.png";
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

  const total = chartData.data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div ref={containerRef} className="piechart-container">
      <div className="piechart-toolbar">
        <button
          onClick={resetZoom}
          className="piechart-toolbar-btn"
          title="Сбросить вид"
        >
          <RefreshCw size={16} />
          <span>Сброс</span>
        </button>
        <div className="piechart-toolbar-divider" />
        <button
          onClick={handleAddSector}
          className="piechart-toolbar-btn"
          title="Добавить сектор"
        >
          <Plus size={16} />
          <span>Сектор</span>
        </button>
        <div className="piechart-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="piechart-toolbar-btn"
          title="Скачать как PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="piechart-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="piechart-toolbar-divider" />
            <button
              onClick={handleSave}
              className="piechart-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="piechart-data-panel">
        <div className="piechart-sectors">
          <div className="piechart-sectors-header">
            <h4>Секторы круговой диаграммы</h4>
            <span className="piechart-total">Итого: {total}</span>
          </div>
          <div className="piechart-sectors-list">
            {chartData.data.map((sector, index) => {
              const percentage = ((sector.value / total) * 100).toFixed(1);
              const color = selectedColors[index % selectedColors.length];
              return (
                <div key={index} className="piechart-sector-item">
                  <div
                    className="piechart-sector-color"
                    style={{ background: color }}
                  />
                  <div className="piechart-sector-info">
                    <span className="piechart-sector-name">{sector.name}</span>
                    <span className="piechart-sector-value">
                      {sector.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="piechart-sector-actions">
                    <button
                      onClick={() => handleEditName(index)}
                      className="piechart-sector-edit"
                      title="Редактировать название"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleEditValue(index)}
                      className="piechart-sector-edit"
                      title="Редактировать значение"
                    >
                      <PieChart size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteSector(index)}
                      className="piechart-sector-delete"
                      title="Удалить сектор"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="piechart-chart-wrapper">
        <Pie ref={chartRef} data={getChartJsData()} options={options} />
      </div>

      {isEditing && (
        <div className="piechart-edit-modal">
          <div className="piechart-edit-modal-content">
            <h3 className="piechart-edit-modal-title">
              {editMode === "name" ? "Редактировать название" : "Редактировать значение"}
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="piechart-edit-modal-input"
              autoFocus
              placeholder={editMode === "name" ? "Название сектора" : "Значение"}
            />
            <div className="piechart-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="piechart-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="piechart-edit-modal-btn save"
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

export const PieChartViewer = (props: PieChartViewerProps) => {
  return <PieChartViewerContent {...props} />;
};