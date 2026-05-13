import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Target,
  ListChecks,
  HelpCircle,
  Shuffle,
  Award,
} from "lucide-react";
import { useQuizSettingsStore } from "@/store/quizSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const QuizSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useQuizSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    questionTypes: true,
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
      title="Параметры теста"
      buttonLabel="Параметры теста"
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
              <label>Предмет</label>
              <input
                type="text"
                placeholder="Например: Математика, История, Физика..."
                value={settings.subject}
                onChange={(e) => updateSetting("subject", e.target.value)}
              />
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Уровень образования</label>
                <select
                  value={settings.educationLevel}
                  onChange={(e) =>
                    updateSetting("educationLevel", e.target.value)
                  }
                >
                  <option value="школьник">Школьник</option>
                  <option value="бакалавриат">Бакалавриат</option>
                  <option value="магистратура">Магистратура</option>
                  <option value="специалитет">Специалитет</option>
                  <option value="СПО">СПО</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Сложность</label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => updateSetting("difficulty", e.target.value)}
                >
                  <option value="начальный">Начальный</option>
                  <option value="средний">Средний</option>
                  <option value="продвинутый">Продвинутый</option>
                  <option value="экспертный">Экспертный</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Количество вопросов</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={settings.questionCount}
                  onChange={(e) =>
                    updateSetting("questionCount", e.target.value)
                  }
                />
              </div>
              <div className="settings-field">
                <label>Вариантов ответа</label>
                <select
                  value={settings.optionsCount}
                  onChange={(e) =>
                    updateSetting("optionsCount", e.target.value)
                  }
                >
                  <option value="2">2 варианта</option>
                  <option value="3">3 варианта</option>
                  <option value="4">4 варианта</option>
                  <option value="5">5 вариантов</option>
                  <option value="6">6 вариантов</option>
                  <option value="7">7 вариантов</option>
                  <option value="8">8 вариантов</option>
                  <option value="9">9 вариантов</option>
                  <option value="10">10 вариантов</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Award size={14} />
                Проверяемая компетенция
              </label>
              <textarea
                placeholder="Например: Способность анализировать правовые нормы и применять их для решения профессиональных задач..."
                value={settings.competence || ""}
                onChange={(e) => updateSetting("competence", e.target.value)}
                rows={3}
                style={{
                  resize: "vertical",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--color-panel-strong)",
                  border: "1px solid var(--color-line)",
                  borderRadius: "8px",
                  color: "var(--color-text)",
                }}
              />
              <small style={{ color: "var(--color-muted)", fontSize: "11px" }}>
                Укажите, какая компетенция проверяется тестом. Это поможет ИИ
                составить релевантные вопросы.
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("questionTypes")}
        >
          <div className="settings-section-header-left">
            <ListChecks size={16} />
            <h4>Типы вопросов</h4>
          </div>
          {expandedSections.questionTypes ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.questionTypes && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeMultipleChoice}
                onChange={(e) =>
                  updateSetting("includeMultipleChoice", e.target.checked)
                }
              />
              <span>Вопросы с выбором ответа</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeTrueFalse}
                onChange={(e) =>
                  updateSetting("includeTrueFalse", e.target.checked)
                }
              />
              <span>Вопросы &quot;Верно/Неверно&quot;</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeOpenEnded}
                onChange={(e) =>
                  updateSetting("includeOpenEnded", e.target.checked)
                }
              />
              <span>Открытые вопросы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeMatching}
                onChange={(e) =>
                  updateSetting("includeMatching", e.target.checked)
                }
              />
              <span>Вопросы на соответствие</span>
            </label>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("advanced")}
        >
          <div className="settings-section-header-left">
            <Target size={16} />
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
            <div className="settings-field">
              <label>Проходной балл (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="70"
                value={settings.passingScore}
                onChange={(e) => updateSetting("passingScore", e.target.value)}
              />
            </div>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeExplanation}
                onChange={(e) =>
                  updateSetting("includeExplanation", e.target.checked)
                }
              />
              <HelpCircle size={14} />
              <span>Показывать объяснение ответов</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.randomizeOrder}
                onChange={(e) =>
                  updateSetting("randomizeOrder", e.target.checked)
                }
              />
              <Shuffle size={14} />
              <span>Перемешивать вопросы</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
