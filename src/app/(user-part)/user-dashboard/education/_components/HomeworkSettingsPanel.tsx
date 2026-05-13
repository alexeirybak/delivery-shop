import { useState } from "react";
import { ChevronDown, ChevronUp, GraduationCap, Sparkles } from "lucide-react";
import { useHomeworkSettingsStore } from "@/store/homeworkSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const HomeworkSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useHomeworkSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    evaluation: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры проверки ДЗ"
      buttonLabel="Параметры проверки"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("main")}
        >
          <div className="settings-section-header-left">
            <GraduationCap size={16} />
            <h4>Основные параметры</h4>
          </div>
          {expandedSections.main ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.main && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Предмет</label>
              <input
                type="text"
                placeholder="Например: математика, физика, химия, английский язык..."
                value={settings.subject}
                onChange={(e) => updateSetting("subject", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Класс</label>
              <select
                value={settings.grade}
                onChange={(e) => updateSetting("grade", e.target.value)}
              >
                <option value="1">1 класс</option>
                <option value="2">2 класс</option>
                <option value="3">3 класс</option>
                <option value="4">4 класс</option>
                <option value="5">5 класс</option>
                <option value="6">6 класс</option>
                <option value="7">7 класс</option>
                <option value="8">8 класс</option>
                <option value="9">9 класс</option>
                <option value="10">10 класс</option>
                <option value="11">11 класс</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("evaluation")}
        >
          <div className="settings-section-header-left">
            <Sparkles size={16} />
            <h4>Параметры оценки</h4>
          </div>
          {expandedSections.evaluation ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.evaluation && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Строгость проверки</label>
              <select
                value={settings.strictness}
                onChange={(e) => updateSetting("strictness", e.target.value)}
              >
                <option value="strict">Строгий</option>
                <option value="normal">Средний</option>
                <option value="lenient">Лояльный</option>
              </select>
            </div>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeExplanation}
                onChange={(e) =>
                  updateSetting("includeExplanation", e.target.checked)
                }
              />
              <span>Пояснять ошибки</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
