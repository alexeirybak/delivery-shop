import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { useBarchartSettingsStore } from "@/store/barchartSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const BarchartSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useBarchartSettingsStore();

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
      title="Параметры столбчатой диаграммы"
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
            <BarChart3 size={16} />
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
              <label>Максимальное количество столбцов</label>
              <select
                value={settings.maxBars}
                onChange={(e) =>
                  updateSetting("maxBars", parseInt(e.target.value))
                }
              >
                <option value="5">~5 столбцов</option>
                <option value="10">~10 столбцов</option>
                <option value="15">~15 столбцов</option>
                <option value="20">~20 столбцов</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Сортировка</label>
              <select
                value={settings.sortOrder}
                onChange={(e) =>
                  updateSetting(
                    "sortOrder",
                    e.target.value as "none" | "asc" | "desc",
                  )
                }
              >
                <option value="none">Без сортировки</option>
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
