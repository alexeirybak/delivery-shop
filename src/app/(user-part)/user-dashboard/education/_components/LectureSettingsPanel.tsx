import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useLectureSettingsStore } from "@/store/lectureSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const LectureSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useLectureSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    audience: true,
    structure: true,
    style: true,
    media: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры лекции"
      buttonLabel="Параметры лекции"
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
            <h4>Аудитория и формат</h4>
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
                <option value="postgraduates">Аспиранты</option>
                <option value="professionals">Профессионалы</option>
                <option value="mixed">Смешанная аудитория</option>
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
                <option value="expert">Экспертный</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Длительность лекции</label>
              <select
                value={settings.duration}
                onChange={(e) => updateSetting("duration", e.target.value)}
              >
                <option value="15">15 минут (мини-лекция)</option>
                <option value="30">30 минут</option>
                <option value="45">45 минут (академический час)</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут (спаренная лекция)</option>
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
            <BookOpen size={16} />
            <h4>Структура лекции</h4>
          </div>
          {expandedSections.structure ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.structure && (
          <div className="settings-section-content">
            <div className="settings-checkbox-group">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeGoal}
                  onChange={(e) =>
                    updateSetting("includeGoal", e.target.checked)
                  }
                />
                <span>Цель и задачи лекции</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeOutline}
                  onChange={(e) =>
                    updateSetting("includeOutline", e.target.checked)
                  }
                />
                <span>План лекции</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeKeyTerms}
                  onChange={(e) =>
                    updateSetting("includeKeyTerms", e.target.checked)
                  }
                />
                <span>Ключевые термины</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeExamples}
                  onChange={(e) =>
                    updateSetting("includeExamples", e.target.checked)
                  }
                />
                <span>Примеры и кейсы</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeSummary}
                  onChange={(e) =>
                    updateSetting("includeSummary", e.target.checked)
                  }
                />
                <span>Резюме и выводы</span>
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
                  checked={settings.includeReferences}
                  onChange={(e) =>
                    updateSetting("includeReferences", e.target.checked)
                  }
                />
                <span>Список литературы</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("style")}
        >
          <div className="settings-section-header-left">
            <Sparkles size={16} />
            <h4>Стиль изложения</h4>
          </div>
          {expandedSections.style ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.style && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Стиль лекции</label>
              <select
                value={settings.style}
                onChange={(e) => updateSetting("style", e.target.value)}
              >
                <option value="academic">
                  Академический (строгий, научный)
                </option>
                <option value="practical">Практический (кейсы, примеры)</option>
                <option value="problematic">
                  Проблемный (вопросы, дискуссия)
                </option>
                <option value="narrative">
                  Нарративный (рассказ, история)
                </option>
                <option value="interactive">
                  Интерактивный (вовлечение аудитории)
                </option>
              </select>
            </div>
            <div className="settings-field">
              <label>Акценты в содержании</label>
              <textarea
                rows={2}
                placeholder="Например: упор на современные исследования, связь с практикой, междисциплинарный подход"
                value={settings.focusAreas}
                onChange={(e) => updateSetting("focusAreas", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
