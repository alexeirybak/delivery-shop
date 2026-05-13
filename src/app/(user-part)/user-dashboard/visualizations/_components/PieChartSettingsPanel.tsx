import { useState } from "react";
import { ChevronDown, ChevronUp, PieChart } from "lucide-react";
import { usePieChartSettingsStore } from "@/store/pieChartSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const PieChartSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = usePieChartSettingsStore();

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
      title="Параметры круговой диаграммы"
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
            <PieChart size={16} />
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
              <label>Максимальное количество секторов</label>
              <select
                value={settings.maxSectors}
                onChange={(e) =>
                  updateSetting("maxSectors", parseInt(e.target.value))
                }
              >
                <option value="4">~4 сектора</option>
                <option value="6">~6 секторов</option>
                <option value="8">~8 секторов</option>
                <option value="10">~10 секторов</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};