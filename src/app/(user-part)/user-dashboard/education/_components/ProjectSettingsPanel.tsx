import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Target,
  ClipboardList,
  FileText,
  Star,
} from "lucide-react";
import { useProjectSettingsStore } from "@/store/projectSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const ProjectSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useProjectSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    structure: true,
    evaluation: true,
    resources: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры проектной работы"
      buttonLabel="Параметры проекта"
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
            <Target size={16} />
            <h4>Основная информация</h4>
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
              <label>Тип проекта</label>
              <select
                value={settings.projectType}
                onChange={(e) => updateSetting("projectType", e.target.value)}
              >
                <option value="research">Исследовательский проект</option>
                <option value="practical">
                  Практико-ориентированный проект
                </option>
                <option value="creative">Творческий проект</option>
                <option value="social">Социальный проект</option>
                <option value="business">Бизнес-проект</option>
                <option value="it">IT-проект</option>
              </select>
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
                <option value="expert">Экспертный</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Формат работы</label>
              <select
                value={settings.workFormat}
                onChange={(e) => updateSetting("workFormat", e.target.value)}
              >
                <option value="individual">Индивидуальный</option>
                <option value="pair">В паре</option>
                <option value="small_group">Малая группа (3-4 человека)</option>
                <option value="team">Команда (5-7 человек)</option>
                <option value="large_group">Крупная группа (8+ человек)</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Длительность проекта</label>
              <select
                value={settings.duration}
                onChange={(e) => updateSetting("duration", e.target.value)}
              >
                <option value="1_week">1 неделя (мини-проект)</option>
                <option value="2_weeks">2 недели</option>
                <option value="1_month">1 месяц</option>
                <option value="2_months">2 месяца</option>
                <option value="1_semester">1 семестр</option>
                <option value="year">Годовой проект</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("structure")}
        >
          <div className="settings-section-header-left">
            <ClipboardList size={16} />
            <h4>Структура проекта</h4>
          </div>
          {expandedSections.structure ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.structure && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeGoal}
                onChange={(e) => updateSetting("includeGoal", e.target.checked)}
              />
              <span>Цель и задачи проекта</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includePlan}
                onChange={(e) => updateSetting("includePlan", e.target.checked)}
              />
              <span>План работы (этапы)</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeLiterature}
                onChange={(e) =>
                  updateSetting("includeLiterature", e.target.checked)
                }
              />
              <span>Обзор литературы / Анализ аналогов</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeMethodology}
                onChange={(e) =>
                  updateSetting("includeMethodology", e.target.checked)
                }
              />
              <span>Методология / Методы исследования</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeResults}
                onChange={(e) =>
                  updateSetting("includeResults", e.target.checked)
                }
              />
              <span>Результаты и выводы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includePresentation}
                onChange={(e) =>
                  updateSetting("includePresentation", e.target.checked)
                }
              />
              <span>Рекомендации по презентации</span>
            </label>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("evaluation")}
        >
          <div className="settings-section-header-left">
            <Star size={16} />
            <h4>Критерии оценки</h4>
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
              <label>Критерии оценки</label>
              <textarea
                rows={3}
                placeholder="Например: актуальность темы, глубина проработки, практическая значимость, качество презентации..."
                value={settings.evaluationCriteria}
                onChange={(e) =>
                  updateSetting("evaluationCriteria", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Максимальный балл</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={settings.maxScore}
                onChange={(e) => updateSetting("maxScore", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("resources")}
        >
          <div className="settings-section-header-left">
            <FileText size={16} />
            <h4>Ресурсы и требования</h4>
          </div>
          {expandedSections.resources ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.resources && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Требования к оформлению</label>
              <textarea
                rows={2}
                placeholder="Например: объем работы, структура отчета, формат сдачи..."
                value={settings.requirements}
                onChange={(e) => updateSetting("requirements", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Рекомендуемые ресурсы</label>
              <textarea
                rows={2}
                placeholder="Например: источники литературы, онлайн-курсы, инструменты..."
                value={settings.resources}
                onChange={(e) => updateSetting("resources", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
