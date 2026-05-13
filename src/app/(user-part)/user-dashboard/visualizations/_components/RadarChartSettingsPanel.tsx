import { useState } from "react";
import { ChevronDown, ChevronUp, Radar } from "lucide-react";
import { useRadarChartSettingsStore } from "@/store/radarChartSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const RadarChartSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useRadarChartSettingsStore();

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
      title="Параметры лепестковой диаграммы"
      buttonLabel="Параметры диаграммы"
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
            <Radar size={16} />
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
              <label>Максимальное количество осей</label>
              <select
                value={settings.maxAxes}
                onChange={(e) =>
                  updateSetting("maxAxes", parseInt(e.target.value))
                }
              >
                <option value="4">~4 оси</option>
                <option value="6">~6 осей</option>
                <option value="8">~8 осей</option>
                <option value="10">~10 осей</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
