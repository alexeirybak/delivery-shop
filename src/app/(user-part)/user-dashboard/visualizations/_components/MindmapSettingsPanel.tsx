import { useState } from "react";
import { ChevronDown, ChevronUp, GitBranch } from "lucide-react";
import { useMindmapSettingsStore } from "@/store/mindmapSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const MindmapSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useMindmapSettingsStore();
  const [expandedSections, setExpandedSections] = useState({ basic: true });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры ментальной карты"
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
            <GitBranch size={16} />
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
              <label>Глубина карты (уровни вложенности)</label>
              <select
                value={settings.depth}
                onChange={(e) => updateSetting("depth", e.target.value)}
              >
                <option value="2">2 уровня</option>
                <option value="3">3 уровня</option>
                <option value="4">4 уровня</option>
                <option value="5">5 уровней</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Примерное количество узлов</label>
              <select
                value={settings.nodeCount}
                onChange={(e) => updateSetting("nodeCount", e.target.value)}
              >
                <option value="5">~5 узлов</option>
                <option value="10">~10 узлов</option>
                <option value="15">~15 узлов</option>
                <option value="20">~20 узлов</option>
                <option value="30">~30 узлов</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
