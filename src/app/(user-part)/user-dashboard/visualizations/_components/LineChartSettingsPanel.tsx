import { useState } from "react";
import { ChevronDown, ChevronUp, LineChart } from "lucide-react";
import { useLineChartSettingsStore } from "@/store/lineChartSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const LineChartSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useLineChartSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры линейного графика"
      buttonLabel="Параметры графика"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("basic")}
        >
          <div className="settings-section-header-left">
            <LineChart size={16} />
            <h4>Основные параметры</h4>
          </div>
          {expandedSections.basic ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.basic && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Максимальное количество точек</label>
              <select
                value={settings.maxPoints}
                onChange={(e) =>
                  updateSetting("maxPoints", parseInt(e.target.value))
                }
              >
                <option value="5">~5 точек</option>
                <option value="10">~10 точек</option>
                <option value="15">~15 точек</option>
                <option value="20">~20 точек</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
