import { useState } from "react";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import { useFlashcardsSettingsStore } from "@/store/flashcardsSettingsStore";

export const FlashcardsSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useFlashcardsSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры карточек"
      buttonLabel="Параметры карточек"
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
            <Layers size={16} />
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
              <label>Количество карточек</label>
              <select
                value={settings.cardCount}
                onChange={(e) =>
                  updateSetting("cardCount", parseInt(e.target.value))
                }
              >
                <option value="5">~5 карточек</option>
                <option value="10">~10 карточек</option>
                <option value="15">~15 карточек</option>
                <option value="20">~20 карточек</option>
              </select>
              <span className="settings-hint">
                Сколько карточек будет сгенерировано
              </span>
            </div>

            <div className="settings-field">
              <label>Сложность</label>
              <select
                value={settings.difficulty}
                onChange={(e) =>
                  updateSetting(
                    "difficulty",
                    e.target.value as "easy" | "medium" | "hard",
                  )
                }
              >
                <option value="easy">Легкий уровень</option>
                <option value="medium">Средний уровень</option>
                <option value="hard">Сложный уровень</option>
              </select>
              <span className="settings-hint">
                Насколько подробными будут вопросы и ответы
              </span>
            </div>

            <div className="settings-field">
              <label>Режим ответа</label>
              <select
                value={settings.answerMode}
                onChange={(e) =>
                  updateSetting(
                    "answerMode",
                    e.target.value as "short" | "detailed",
                  )
                }
              >
                <option value="short">Краткий (один абзац)</option>
                <option value="detailed">Развернутый (до 2-3 абзацев)</option>
              </select>
              <span className="settings-hint">
                Как подробно будет описан ответ
              </span>
            </div>

            <div className="settings-field">
              <label>Включить примеры</label>
              <select
                value={settings.includeExamples ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting("includeExamples", e.target.value === "yes")
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Добавлять ли примеры к ответам
              </span>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
