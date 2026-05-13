import { useState } from "react";
import { ChevronDown, ChevronUp, Table } from "lucide-react";
import { useComparisonTableSettingsStore } from "@/store/comparisonTableSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const ComparisonTableSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useComparisonTableSettingsStore();

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
      title="Параметры сравнительной таблицы"
      buttonLabel="Параметры таблицы"
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
            <Table size={16} />
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
              <label>Максимальное количество строк</label>
              <select
                value={settings.maxRows}
                onChange={(e) =>
                  updateSetting("maxRows", parseInt(e.target.value))
                }
              >
                <option value="5">~5 строк</option>
                <option value="10">~10 строк</option>
                <option value="15">~15 строк</option>
                <option value="20">~20 строк</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Максимальное количество столбцов</label>
              <select
                value={settings.maxColumns}
                onChange={(e) =>
                  updateSetting("maxColumns", parseInt(e.target.value))
                }
              >
                <option value="4">~4 столбца</option>
                <option value="6">~6 столбцов</option>
                <option value="8">~8 столбцов</option>
                <option value="10">~10 столбцов</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};