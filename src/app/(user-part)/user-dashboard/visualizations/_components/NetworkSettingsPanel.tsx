import { useState } from "react";
import { ChevronDown, ChevronUp, Network } from "lucide-react";
import { useNetworkSettingsStore } from "@/store/networkSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const NetworkSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useNetworkSettingsStore();

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
      title="Параметры сетевого графа"
      buttonLabel="Параметры графа"
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
            <Network size={16} />
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

            <div className="settings-field">
              <label>Максимальное количество связей</label>
              <select
                value={settings.maxEdges}
                onChange={(e) =>
                  updateSetting("maxEdges", parseInt(e.target.value))
                }
              >
                <option value="10">~10 связей</option>
                <option value="15">~15 связей</option>
                <option value="20">~20 связей</option>
                <option value="30">~30 связей</option>
                <option value="50">~50 связей</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
