import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  FileQuestion,
  Award,
} from "lucide-react";
import { useExamsSettingsStore } from "@/store/examsSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const ExamsSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useExamsSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    structure: true,
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
      title="Параметры экзамена"
      buttonLabel="Параметры экзамена"
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
            <GraduationCap size={16} />
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
              <label>Тип экзамена</label>
              <select
                value={settings.examType}
                onChange={(e) => updateSetting("examType", e.target.value)}
              >
                <option value="final">Итоговый экзамен</option>
                <option value="midterm">Промежуточный экзамен</option>
                <option value="entrance">Вступительный экзамен</option>
                <option value="certification">Квалификационный экзамен</option>
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
              <label>Длительность (минут)</label>
              <select
                value={settings.duration}
                onChange={(e) => updateSetting("duration", e.target.value)}
              >
                <option value="30">30 минут</option>
                <option value="45">45 минут</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут</option>
                <option value="120">120 минут</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Количество вопросов</label>
              <input
                type="number"
                min="1"
                max="200"
                placeholder="20"
                value={settings.questionCount}
                onChange={(e) => updateSetting("questionCount", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Шкала оценок</label>
              <select
                value={settings.gradingScale}
                onChange={(e) => updateSetting("gradingScale", e.target.value)}
              >
                <option value="5_point">5-балльная (2-5)</option>
                <option value="100_point">100-балльная</option>
                <option value="european">ECTS (A-F)</option>
                <option value="pass_fail">Зачёт/Незачёт</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Проходной балл (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="60"
                value={settings.passingScore}
                onChange={(e) => updateSetting("passingScore", e.target.value)}
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
            <FileQuestion size={16} />
            <h4>Структура экзамена</h4>
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
                checked={settings.includeTheory}
                onChange={(e) =>
                  updateSetting("includeTheory", e.target.checked)
                }
              />
              <span>Теоретические вопросы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includePractice}
                onChange={(e) =>
                  updateSetting("includePractice", e.target.checked)
                }
              />
              <span>Практические задания</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeTest}
                onChange={(e) => updateSetting("includeTest", e.target.checked)}
              />
              <span>Тестовые задания</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeCases}
                onChange={(e) =>
                  updateSetting("includeCases", e.target.checked)
                }
              />
              <span>Кейсы и ситуации</span>
            </label>

            <div className="settings-field">
              <label>Разрешенные материалы</label>
              <textarea
                rows={2}
                placeholder="Например: калькулятор, справочные материалы, конспекты..."
                value={settings.allowedMaterials}
                onChange={(e) =>
                  updateSetting("allowedMaterials", e.target.value)
                }
              />
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
            <Award size={16} />
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
                placeholder="Например: глубина знаний, полнота ответа, аргументация, практические навыки..."
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
