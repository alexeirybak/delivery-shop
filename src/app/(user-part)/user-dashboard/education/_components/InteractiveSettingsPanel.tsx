import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Gamepad2,
  ListChecks,
  Trophy,
} from "lucide-react";
import { useInteractiveSettingsStore } from "@/store/interactiveSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const InteractiveSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useInteractiveSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    audience: true,
    format: true,
    activities: true,
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
      title="Параметры интерактивного урока"
      buttonLabel="Параметры урока"
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
              </select>
            </div>

            <div className="settings-field">
              <label>Количество участников</label>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="20"
                value={settings.participantCount}
                onChange={(e) =>
                  updateSetting("participantCount", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Длительность урока</label>
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
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("format")}
        >
          <div className="settings-section-header-left">
            <Gamepad2 size={16} />
            <h4>Формат и методы</h4>
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
              <label>Тип интерактивного урока</label>
              <select
                value={settings.interactiveType}
                onChange={(e) =>
                  updateSetting("interactiveType", e.target.value)
                }
              >
                <option value="quiz">Викторина / Тест</option>
                <option value="game">Игровой урок</option>
                <option value="discussion">Интерактивная дискуссия</option>
                <option value="brainstorm">Мозговой штурм</option>
                <option value="role_play">Ролевая игра</option>
                <option value="case_study">Разбор кейсов</option>
                <option value="simulation">Симуляция</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Методы вовлечения</label>
              <textarea
                rows={2}
                placeholder="Например: опросы, голосования, групповые обсуждения, квизы..."
                value={settings.engagementMethods}
                onChange={(e) =>
                  updateSetting("engagementMethods", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("activities")}
        >
          <div className="settings-section-header-left">
            <ListChecks size={16} />
            <h4>Активности</h4>
          </div>
          {expandedSections.activities ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.activities && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeWarmup}
                onChange={(e) =>
                  updateSetting("includeWarmup", e.target.checked)
                }
              />
              <span>Разминка / Ледокол</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includePoll}
                onChange={(e) => updateSetting("includePoll", e.target.checked)}
              />
              <span>Опросы / Голосования</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeGroupWork}
                onChange={(e) =>
                  updateSetting("includeGroupWork", e.target.checked)
                }
              />
              <span>Групповая работа</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeQuiz}
                onChange={(e) => updateSetting("includeQuiz", e.target.checked)}
              />
              <span>Викторина / Квиз</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeDiscussion}
                onChange={(e) =>
                  updateSetting("includeDiscussion", e.target.checked)
                }
              />
              <span>Дискуссионные вопросы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeReflection}
                onChange={(e) =>
                  updateSetting("includeReflection", e.target.checked)
                }
              />
              <span>Рефлексия / Обратная связь</span>
            </label>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("assessment")}
        >
          <div className="settings-section-header-left">
            <Trophy size={16} />
            <h4>Оценка и мотивация</h4>
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
                checked={settings.includePoints}
                onChange={(e) =>
                  updateSetting("includePoints", e.target.checked)
                }
              />
              <span>Система баллов / Очки</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeBadges}
                onChange={(e) =>
                  updateSetting("includeBadges", e.target.checked)
                }
              />
              <span>Награды / Бейджи</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeLeaderboard}
                onChange={(e) =>
                  updateSetting("includeLeaderboard", e.target.checked)
                }
              />
              <span>Таблица лидеров</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeFeedback}
                onChange={(e) =>
                  updateSetting("includeFeedback", e.target.checked)
                }
              />
              <span>Мгновенная обратная связь</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
