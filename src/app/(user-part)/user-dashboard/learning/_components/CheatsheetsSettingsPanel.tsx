import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Settings2 } from "lucide-react";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import { useCheatsheetsSettingsStore } from "@/store/cheatsheetsSettingsStore";

export const CheatsheetsSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useCheatsheetsSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры шпаргалки"
      buttonLabel="Настройки шпаргалки"
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
            <Sparkles size={16} />
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
              <label>Формат шпаргалки</label>
              <select
                value={settings.format}
                onChange={(e) =>
                  updateSetting("format", e.target.value as "compact" | "detailed")
                }
              >
                <option value="compact">Компактный (ключевые пункты)</option>
                <option value="detailed">Подробный (с пояснениями)</option>
              </select>
              <span className="settings-hint">
                Компактный — только суть, Подробный — с пояснениями
              </span>
            </div>

            <div className="settings-field">
              <label>Количество пунктов</label>
              <select
                value={settings.maxItems}
                onChange={(e) =>
                  updateSetting("maxItems", parseInt(e.target.value))
                }
              >
                <option value="5">~5 пунктов</option>
                <option value="10">~10 пунктов</option>
                <option value="15">~15 пунктов</option>
                <option value="20">~20 пунктов</option>
              </select>
              <span className="settings-hint">
                Сколько ключевых пунктов будет в шпаргалке
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("advanced")}
        >
          <div className="settings-section-header-left">
            <Settings2 size={16} />
            <h4>Дополнительные параметры</h4>
          </div>
          {expandedSections.advanced ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.advanced && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeExamples}
                onChange={(e) =>
                  updateSetting("includeExamples", e.target.checked)
                }
              />
              <span>Включать примеры</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeFormulas}
                onChange={(e) =>
                  updateSetting("includeFormulas", e.target.checked)
                }
              />
              <span>Включать формулы и обозначения</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};