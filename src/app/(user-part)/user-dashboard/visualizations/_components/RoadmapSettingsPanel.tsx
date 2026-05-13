import { useState } from "react";
import { ChevronDown, ChevronUp, Compass } from "lucide-react";
import { useRoadmapSettingsStore } from "@/store/roadmapSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const RoadmapSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useRoadmapSettingsStore();

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
      title="Параметры дорожной карты"
      buttonLabel="Параметры карты"
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
            <Compass size={16} />
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
              <label>Максимальное количество этапов</label>
              <select
                value={settings.maxPhases}
                onChange={(e) =>
                  updateSetting("maxPhases", parseInt(e.target.value))
                }
              >
                <option value="3">~3 этапа</option>
                <option value="4">~4 этапа</option>
                <option value="5">~5 этапов</option>
                <option value="6">~6 этапов</option>
                <option value="8">~8 этапов</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Максимальное количество задач на этап</label>
              <select
                value={settings.maxTasks}
                onChange={(e) =>
                  updateSetting("maxTasks", parseInt(e.target.value))
                }
              >
                <option value="2">~2 задачи</option>
                <option value="3">~3 задачи</option>
                <option value="4">~4 задачи</option>
                <option value="5">~5 задач</option>
                <option value="6">~6 задач</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};