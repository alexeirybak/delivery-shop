import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Brain,
  BookOpen,
  Calculator,
  Microscope,
  Settings2,
} from "lucide-react";
import { useSolutionSettingsStore } from "@/store/solutionSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/solution-settings.css";

const DISCIPLINE_TYPES = {
  humanities: {
    label: "Гуманитарные науки",
    icon: BookOpen,
    description: "Литература, история, философия, право",
  },
  natural_science: {
    label: "Естественные науки",
    icon: Microscope,
    description: "Биология, физика, химия, география, медицина",
  },
  technical: {
    label: "Технические науки",
    icon: Settings2,
    description: "Машиностроение, инженерия, информатика",
  },
  mathematics: {
    label: "Математика",
    icon: Calculator,
    description: "Алгебра, геометрия, матанализ, экономика",
  },
};

export const SolutionSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useSolutionSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    main: true,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDisciplineChange = (discipline: string) => {
    updateSetting("discipline", discipline);
  };

  return (
    <SettingsPanelLayout
      title="Параметры решения задач"
      buttonLabel="Настройки решения"
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
            <Brain size={16} />
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
              <label>Тип задачи</label>
              <div className="solution-discipline-grid">
                {Object.entries(DISCIPLINE_TYPES).map(([key, value]) => {
                  const Icon = value.icon;
                  return (
                    <button
                      key={key}
                      className={`solution-discipline-card ${
                        settings.discipline === key ? "active" : ""
                      }`}
                      onClick={() => handleDisciplineChange(key)}
                    >
                      <Icon size={20} />
                      <span>{value.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="solution-discipline-description">
                {settings.discipline &&
                  DISCIPLINE_TYPES[
                    settings.discipline as keyof typeof DISCIPLINE_TYPES
                  ]?.description}
              </div>
            </div>

            <div className="settings-field">
              <label>Предмет / Тема</label>
              <input
                type="text"
                placeholder="Например: алгебра, история России, химия..."
                value={settings.subject}
                onChange={(e) => updateSetting("subject", e.target.value)}
              />
            </div>

            <div className="solution-settings-block">
              <div className="settings-field">
                <label>Уровень образования</label>
                <select
                  value={settings.educationLevel}
                  onChange={(e) =>
                    updateSetting("educationLevel", e.target.value)
                  }
                >
                  <option value="school_5">5-9 класс (школа)</option>
                  <option value="school_10">10-11 класс (старшая школа)</option>
                  <option value="college">Колледж / Техникум</option>
                  <option value="university_bachelor">Бакалавриат</option>
                  <option value="university_master">Магистратура</option>
                </select>
              </div>

              <div className="settings-field">
                <label>Детализация объяснения</label>
                <div className="solution-detail-level">
                  <button
                    className={`solution-detail-btn ${settings.detailLevel === "simple" ? "active" : ""}`}
                    onClick={() => updateSetting("detailLevel", "simple")}
                  >
                    Простое
                  </button>
                  <button
                    className={`solution-detail-btn ${settings.detailLevel === "normal" ? "active" : ""}`}
                    onClick={() => updateSetting("detailLevel", "normal")}
                  >
                    Подробное
                  </button>
                  <button
                    className={`solution-detail-btn ${settings.detailLevel === "expert" ? "active" : ""}`}
                    onClick={() => updateSetting("detailLevel", "expert")}
                  >
                    Экспертное
                  </button>
                </div>
              </div>
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
                checked={settings.showSteps}
                onChange={(e) => updateSetting("showSteps", e.target.checked)}
              />
              <span>Показывать пошаговое решение</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.provideExamples}
                onChange={(e) =>
                  updateSetting("provideExamples", e.target.checked)
                }
              />
              <span>Приводить примеры</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.useFormulas}
                onChange={(e) => updateSetting("useFormulas", e.target.checked)}
              />
              <span>Использовать формулы и обозначения</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
