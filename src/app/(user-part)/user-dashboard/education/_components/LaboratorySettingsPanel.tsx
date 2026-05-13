import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Target,
  ClipboardList,
  AlertCircle,
  Microscope,
} from "lucide-react";
import { useLaboratorySettingsStore } from "@/store/laboratorySettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const LaboratorySettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useLaboratorySettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    audience: true,
    equipment: true,
    structure: true,
    safety: true,
    assessment: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры лабораторной работы"
      buttonLabel="Параметры работы"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("audience")}
        >
          <div className="settings-section-header-left">
            <Users size={16} />
            <h4>Аудитория</h4>
          </div>
          {expandedSections.audience ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.audience && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Целевая аудитория</label>
              <select
                value={settings.targetAudience}
                onChange={(e) =>
                  updateSetting("targetAudience", e.target.value)
                }
              >
                <option value="students_bachelor">Студенты бакалавриата</option>
                <option value="students_master">Магистранты</option>
                <option value="school">Школьники</option>
                <option value="professionals">Профессионалы</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Уровень подготовки</label>
              <select
                value={settings.level}
                onChange={(e) => updateSetting("level", e.target.value)}
              >
                <option value="beginner">Начальный</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Длительность работы</label>
              <select
                value={settings.duration}
                onChange={(e) => updateSetting("duration", e.target.value)}
              >
                <option value="45">45 минут</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут</option>
                <option value="120">120 минут</option>
                <option value="180">180 минут</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("equipment")}
        >
          <div className="settings-section-header-left">
            <Microscope size={16} />
            <h4>Оборудование и материалы</h4>
          </div>
          {expandedSections.equipment ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.equipment && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Необходимое оборудование</label>
              <textarea
                rows={3}
                placeholder="Например: микроскопы, реактивы, измерительные приборы, ПО..."
                value={settings.requiredEquipment}
                onChange={(e) =>
                  updateSetting("requiredEquipment", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Расходные материалы</label>
              <textarea
                rows={2}
                placeholder="Например: пробирки, образцы, фильтры, реактивы..."
                value={settings.consumables}
                onChange={(e) => updateSetting("consumables", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Программное обеспечение</label>
              <input
                type="text"
                placeholder="Например: MATLAB, Python, LabVIEW, симуляторы..."
                value={settings.software}
                onChange={(e) => updateSetting("software", e.target.value)}
              />
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
            <h4>Структура работы</h4>
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
              <span>Цель и задачи работы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeTheory}
                onChange={(e) =>
                  updateSetting("includeTheory", e.target.checked)
                }
              />
              <span>Теоретическое введение</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeProcedure}
                onChange={(e) =>
                  updateSetting("includeProcedure", e.target.checked)
                }
              />
              <span>Ход работы (пошаговая инструкция)</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeObservations}
                onChange={(e) =>
                  updateSetting("includeObservations", e.target.checked)
                }
              />
              <span>Таблицы для наблюдений</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeQuestions}
                onChange={(e) =>
                  updateSetting("includeQuestions", e.target.checked)
                }
              />
              <span>Контрольные вопросы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeReport}
                onChange={(e) =>
                  updateSetting("includeReport", e.target.checked)
                }
              />
              <span>Требования к отчёту</span>
            </label>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("safety")}
        >
          <div className="settings-section-header-left">
            <AlertCircle size={16} />
            <h4>Техника безопасности</h4>
          </div>
          {expandedSections.safety ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.safety && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeSafetyRules}
                onChange={(e) =>
                  updateSetting("includeSafetyRules", e.target.checked)
                }
              />
              <span>Включить правила техники безопасности</span>
            </label>

            {settings.includeSafetyRules && (
              <div className="settings-field">
                <label>Дополнительные правила безопасности</label>
                <textarea
                  rows={2}
                  placeholder="Специфические правила для данной работы..."
                  value={settings.customSafetyRules}
                  onChange={(e) =>
                    updateSetting("customSafetyRules", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("assessment")}
        >
          <div className="settings-section-header-left">
            <Target size={16} />
            <h4>Оценка работы</h4>
          </div>
          {expandedSections.assessment ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.assessment && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeAssessment}
                onChange={(e) =>
                  updateSetting("includeAssessment", e.target.checked)
                }
              />
              <span>Включить критерии оценки</span>
            </label>

            {settings.includeAssessment && (
              <div className="settings-field">
                <label>Критерии оценки</label>
                <textarea
                  rows={3}
                  placeholder="Например: правильность выполнения, полнота отчёта, оформление, соблюдение ТБ..."
                  value={settings.assessmentCriteria}
                  onChange={(e) =>
                    updateSetting("assessmentCriteria", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
