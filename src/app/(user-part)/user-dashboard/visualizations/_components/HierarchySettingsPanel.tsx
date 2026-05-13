import { useState } from "react";
import { ChevronDown, ChevronUp, GitMerge, Layers, Hash } from "lucide-react";
import { useHierarchySettingsStore } from "@/store/hierarchySettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const HierarchySettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useHierarchySettingsStore();

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
      title="Параметры иерархической схемы"
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
            <GitMerge size={16} />
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
              <label>
                <Hash size={12} /> Максимальная глубина
              </label>
              <select
                value={settings.maxDepth}
                onChange={(e) =>
                  updateSetting("maxDepth", parseInt(e.target.value))
                }
              >
                <option value="2">2 уровня</option>
                <option value="3">3 уровня</option>
                <option value="4">4 уровня</option>
                <option value="5">5 уровней</option>
                <option value="0">Без ограничений</option>
              </select>
            </div>

            <div className="settings-field">
              <label>
                <Layers size={12} /> Максимальное количество узлов
              </label>
              <select
                value={settings.maxNodes}
                onChange={(e) =>
                  updateSetting("maxNodes", parseInt(e.target.value))
                }
              >
                <option value="10">~10 узлов</option>
                <option value="20">~20 узлов</option>
                <option value="30">~30 узлов</option>
                <option value="50">~50 узлов</option>
                <option value="0">Без ограничений</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Показывать корневой узел</label>
              <select
                value={settings.showRoot ? "true" : "false"}
                onChange={(e) =>
                  updateSetting("showRoot", e.target.value === "true")
                }
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
