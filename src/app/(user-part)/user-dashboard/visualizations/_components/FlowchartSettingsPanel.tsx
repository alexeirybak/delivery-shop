import { useState } from "react";
import { ChevronDown, ChevronUp, Workflow } from "lucide-react";
import { useFlowchartSettingsStore } from "@/store/flowchartSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const FlowchartSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useFlowchartSettingsStore();

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
      title="Параметры блок-схемы"
      buttonLabel="Параметры схемы"
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
            <Workflow size={16} />
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
              <label>Максимальное количество узлов</label>
              <select
                value={settings.maxNodes}
                onChange={(e) =>
                  updateSetting("maxNodes", parseInt(e.target.value))
                }
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
