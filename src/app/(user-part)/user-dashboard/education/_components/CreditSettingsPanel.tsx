import { useState } from "react";
import { ChevronDown, ChevronUp, FileCheck, HelpCircle } from "lucide-react";
import { useCreditSettingsStore } from "@/store/creditSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const CreditSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useCreditSettingsStore();
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
      title="Параметры зачета"
      buttonLabel="Параметры зачета"
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
            <FileCheck size={16} />
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
              <label>Количество вопросов</label>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="20"
                value={settings.questionCount}
                onChange={(e) => updateSetting("questionCount", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Уровень сложности</label>
              <select
                value={settings.level}
                onChange={(e) => updateSetting("level", e.target.value)}
              >
                <option value="beginner">Начальный</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeAnswers}
                onChange={(e) =>
                  updateSetting("includeAnswers", e.target.checked)
                }
              />
              <HelpCircle size={14} />
              <span>Включить примерные ответы</span>
            </label>

            <div className="settings-field">
              <label>Критерии оценки (для зачета с оценкой)</label>
              <textarea
                rows={2}
                placeholder="Например: полнота ответа, глубина понимания, использование примеров..."
                value={settings.evaluationCriteria}
                onChange={(e) =>
                  updateSetting("evaluationCriteria", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
