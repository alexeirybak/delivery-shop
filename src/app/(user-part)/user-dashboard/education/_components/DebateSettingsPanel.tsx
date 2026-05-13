"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Scale,
  Mic,
  Trophy,
  Lightbulb,
} from "lucide-react";
import {
  useDebateSettingsStore,
  DebateFormat,
  DebateDifficulty,
} from "@/store/debateSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const DebateSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useDebateSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    structure: false,
    content: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры дебатов"
      buttonLabel="Параметры дебатов"
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
            <Mic size={16} />
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
              <label>Формат дебатов</label>
              <select
                value={settings.format}
                onChange={(e) =>
                  updateSetting("format", e.target.value as DebateFormat)
                }
              >
                <option value="classical">Классические дебаты</option>
                <option value="parliamentary">Парламентские дебаты</option>
                <option value="lincoln_douglas">
                  Формат Линкольна-Дугласа
                </option>
                <option value="sparring">Спарринг (тренировочные)</option>
              </select>
            </div>

            <div className="settings-field">
              <label>
                <Clock size={14} /> Длительность (минуты)
              </label>
              <select
                value={settings.duration}
                onChange={(e) =>
                  updateSetting("duration", parseInt(e.target.value))
                }
              >
                <option value="30">30 минут (краткие)</option>
                <option value="45">45 минут (стандартные)</option>
                <option value="60">60 минут (полноценные)</option>
                <option value="90">90 минут (расширенные)</option>
                <option value="120">120 минут (чемпионатные)</option>
              </select>
            </div>

            <div className="settings-field">
              <label>
                <Users size={14} /> Количество участников
              </label>
              <select
                value={settings.participantsCount}
                onChange={(e) =>
                  updateSetting("participantsCount", parseInt(e.target.value))
                }
              >
                <option value="2">2 участника (1v1)</option>
                <option value="4">4 участника (2v2)</option>
                <option value="6">6 участников (3v3)</option>
                <option value="8">8 участников (4v4)</option>
              </select>
            </div>

            <div className="settings-field">
              <label>
                <Trophy size={14} /> Уровень сложности
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) =>
                  updateSetting(
                    "difficulty",
                    e.target.value as DebateDifficulty,
                  )
                }
              >
                <option value="beginner">Начальный (базовые аргументы)</option>
                <option value="intermediate">
                  Средний (развернутая аргументация)
                </option>
                <option value="advanced">Продвинутый (глубокий анализ)</option>
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
            <Scale size={16} />
            <h4>Структура дебатов</h4>
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
                checked={settings.includeOpening}
                onChange={(e) =>
                  updateSetting("includeOpening", e.target.checked)
                }
              />
              <span>Вступительные речи</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeRebuttals}
                onChange={(e) =>
                  updateSetting("includeRebuttals", e.target.checked)
                }
              />
              <span>Контраргументы / Опровержения</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeCrossExamination}
                onChange={(e) =>
                  updateSetting("includeCrossExamination", e.target.checked)
                }
              />
              <span>Перекрестные вопросы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeClosing}
                onChange={(e) =>
                  updateSetting("includeClosing", e.target.checked)
                }
              />
              <span>Заключительные речи</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeJudging}
                onChange={(e) =>
                  updateSetting("includeJudging", e.target.checked)
                }
              />
              <span>Критерии оценки и судейство</span>
            </label>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("content")}
        >
          <div className="settings-section-header-left">
            <Lightbulb size={16} />
            <h4>Содержание аргументов</h4>
          </div>
          {expandedSections.content ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.content && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeArguments}
                onChange={(e) =>
                  updateSetting("includeArguments", e.target.checked)
                }
              />
              <span>Основные аргументы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeCounterArguments}
                onChange={(e) =>
                  updateSetting("includeCounterArguments", e.target.checked)
                }
              />
              <span>Контраргументы</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeEvidence}
                onChange={(e) =>
                  updateSetting("includeEvidence", e.target.checked)
                }
              />
              <span>Доказательства / Источники</span>
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
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
