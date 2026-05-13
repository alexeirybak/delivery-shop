import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Settings2 } from "lucide-react";
import { useGlossarySettingsStore } from "@/store/glossarySettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const GlossarySettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useGlossarySettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
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
      title="Параметры глоссария"
      buttonLabel="Параметры глоссария"
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
            <BookOpen size={16} />
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
              <label>Количество терминов</label>
              <select
                value={settings.termCount}
                onChange={(e) =>
                  updateSetting("termCount", parseInt(e.target.value))
                }
              >
                <option value="10">~10 терминов</option>
                <option value="15">~15 терминов</option>
                <option value="20">~20 терминов</option>
                <option value="30">~30 терминов</option>
              </select>
              <span className="settings-hint">
                Сколько терминов будет сгенерировано
              </span>
            </div>

            <div className="settings-field">
              <label>Детализация</label>
              <select
                value={settings.detailLevel}
                onChange={(e) =>
                  updateSetting(
                    "detailLevel",
                    e.target.value as "compact" | "detailed",
                  )
                }
              >
                <option value="compact">Компактный (только определение)</option>
                <option value="detailed">Подробный (+ примеры)</option>
              </select>
              <span className="settings-hint">
                Насколько подробно будет описан каждый термин
              </span>
            </div>

            <div className="settings-field">
              <label>Сортировка</label>
              <select
                value={settings.sortOrder}
                onChange={(e) =>
                  updateSetting(
                    "sortOrder",
                    e.target.value as
                      | "alphabetical"
                      | "byCategory"
                      | "byRelevance",
                  )
                }
              >
                <option value="alphabetical">По алфавиту (А-Я)</option>
                <option value="byCategory">По категориям</option>
                <option value="byRelevance">По релевантности</option>
              </select>
              <span className="settings-hint">
                Порядок отображения терминов
              </span>
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
            <div className="settings-field">
              <label>Произношение/транскрипция</label>
              <select
                value={settings.includePronunciation ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting(
                    "includePronunciation",
                    e.target.value === "yes",
                  )
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Добавлять ли транскрипцию для сложных терминов
              </span>
            </div>

            <div className="settings-field">
              <label>Связанные термины</label>
              <select
                value={settings.includeRelatedTerms ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting("includeRelatedTerms", e.target.value === "yes")
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Показывать связи между терминами
              </span>
            </div>

            <div className="settings-field">
              <label>Примеры использования</label>
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
                Добавлять ли примеры к определениям
              </span>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
