import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  Sparkles,
  CheckSquare,
  Presentation,
} from "lucide-react";
import { usePracticalSettingsStore } from "@/store/practicalSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const PracticalSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = usePracticalSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    audience: true,
    format: true,
    structure: true,
    assessment: true,
    style: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры практического занятия"
      buttonLabel="Параметры занятия"
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
              <label>Длительность занятия</label>
              <select
                value={settings.duration}
                onChange={(e) => updateSetting("duration", e.target.value)}
              >
                <option value="45">45 минут (академический час)</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут (спаренное занятие)</option>
                <option value="120">120 минут (2 академических часа)</option>
                <option value="180">180 минут (3 академических часа)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("format")}
        >
          <div className="settings-section-header-left">
            <Presentation size={16} />
            <h4>Формат занятия</h4>
          </div>
          {expandedSections.format ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.format && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Тип практического занятия</label>
              <select
                value={settings.practicalType}
                onChange={(e) => updateSetting("practicalType", e.target.value)}
              >
                <option value="seminar">Семинар</option>
                <option value="workshop">Практикум / Workshop</option>
                <option value="case_study">Разбор кейсов</option>
                <option value="discussion">Дискуссия</option>
                <option value="round_table">Круглый стол</option>
                <option value="problem_solving">
                  Решение практических задач
                </option>
                <option value="role_play">Ролевая игра</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Форма работы</label>
              <select
                value={settings.workFormat}
                onChange={(e) => updateSetting("workFormat", e.target.value)}
              >
                <option value="individual">Индивидуальная</option>
                <option value="pairs">В парах</option>
                <option value="small_groups">
                  В малых группах (3-5 человек)
                </option>
                <option value="team">Командная (5-7 человек)</option>
                <option value="collective">Коллективное обсуждение</option>
                <option value="mixed">Смешанный формат</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Количество участников (для групповой работы)</label>
              <input
                type="number"
                min="2"
                max="50"
                placeholder="Не указано"
                value={settings.groupSize || ""}
                onChange={(e) => updateSetting("groupSize", e.target.value)}
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
            <BookOpen size={16} />
            <h4>Структура занятия</h4>
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
                <span>Цели и задачи занятия</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includePlan}
                  onChange={(e) =>
                    updateSetting("includePlan", e.target.checked)
                  }
                />
                <span>План занятия</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeTheoretical}
                  onChange={(e) =>
                    updateSetting("includeTheoretical", e.target.checked)
                  }
                />
                <span>Краткий теоретический блок</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeTasks}
                  onChange={(e) =>
                    updateSetting("includeTasks", e.target.checked)
                  }
                />
                <span>Практические задания</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeDiscussion}
                  onChange={(e) =>
                    updateSetting("includeDiscussion", e.target.checked)
                  }
                />
                <span>Вопросы для обсуждения</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeSummary}
                  onChange={(e) =>
                    updateSetting("includeSummary", e.target.checked)
                  }
                />
                <span>Подведение итогов</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.includeReferences}
                  onChange={(e) =>
                    updateSetting("includeReferences", e.target.checked)
                  }
                />
                <span>Список рекомендуемой литературы</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("assessment")}
        >
          <div className="settings-section-header-left">
            <CheckSquare size={16} />
            <h4>Критерии оценки</h4>
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
                <label>Критерии оценки (через запятую)</label>
                <textarea
                  rows={3}
                  placeholder="Например: полнота ответа, аргументация, использование источников, активность в дискуссии"
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

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("style")}
        >
          <div className="settings-section-header-left">
            <Sparkles size={16} />
            <h4>Стиль проведения</h4>
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
              <label>Стиль проведения</label>
              <select
                value={settings.style}
                onChange={(e) => updateSetting("style", e.target.value)}
              >
                <option value="academic">Академический</option>
                <option value="interactive">Интерактивный</option>
                <option value="problem">Проблемно-ориентированный</option>
                <option value="practice">Практико-ориентированный</option>
                <option value="discussion">Дискуссионный</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Дополнительные пожелания</label>
              <textarea
                rows={2}
                placeholder="Любые дополнительные требования или пожелания к занятию"
                value={settings.additionalNotes}
                onChange={(e) =>
                  updateSetting("additionalNotes", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
