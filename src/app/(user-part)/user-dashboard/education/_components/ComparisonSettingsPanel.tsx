import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Layers, BookOpen } from "lucide-react";
import { useComparisonSettingsStore } from "@/store/comparisonSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const ComparisonSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    updateAspect,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useComparisonSettingsStore();

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    aspects: false,
    output: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры сравнительного анализа"
      buttonLabel="Параметры анализа"
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
            <Zap size={16} />
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
              <label>Глубина анализа</label>
              <select
                value={settings.depth}
                onChange={(e) =>
                  updateSetting(
                    "depth",
                    e.target.value as "basic" | "detailed" | "expert",
                  )
                }
              >
                <option value="basic">
                  Базовый (основные сходства и различия)
                </option>
                <option value="detailed">Детальный (развернутый анализ)</option>
                <option value="expert">
                  Экспертный (глубокий критический анализ)
                </option>
              </select>
            </div>

            <div className="settings-field">
              <label>Максимальное количество пунктов</label>
              <select
                value={settings.maxItems}
                onChange={(e) =>
                  updateSetting("maxItems", parseInt(e.target.value))
                }
              >
                <option value="5">~5 пунктов</option>
                <option value="10">~10 пунктов</option>
                <option value="15">~15 пунктов</option>
                <option value="20">~20 пунктов</option>
              </select>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.includeSources}
                  onChange={(e) =>
                    updateSetting("includeSources", e.target.checked)
                  }
                />
                <span>Указывать источники</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("aspects")}
        >
          <div className="settings-section-header-left">
            <Layers size={16} />
            <h4>Аспекты сравнения</h4>
          </div>
          {expandedSections.aspects ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.aspects && (
          <div className="settings-section-content">
            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.similarities}
                  onChange={(e) =>
                    updateAspect("similarities", e.target.checked)
                  }
                />
                <span>Сходства</span>
              </label>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.differences}
                  onChange={(e) =>
                    updateAspect("differences", e.target.checked)
                  }
                />
                <span>Различия</span>
              </label>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.advantages}
                  onChange={(e) => updateAspect("advantages", e.target.checked)}
                />
                <span>Преимущества</span>
              </label>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.disadvantages}
                  onChange={(e) =>
                    updateAspect("disadvantages", e.target.checked)
                  }
                />
                <span>Недостатки</span>
              </label>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.examples}
                  onChange={(e) => updateAspect("examples", e.target.checked)}
                />
                <span>Примеры</span>
              </label>
            </div>

            <div className="settings-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.aspects.conclusions}
                  onChange={(e) =>
                    updateAspect("conclusions", e.target.checked)
                  }
                />
                <span>Выводы и рекомендации</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("output")}
        >
          <div className="settings-section-header-left">
            <BookOpen size={16} />
            <h4>Формат вывода</h4>
          </div>
          {expandedSections.output ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.output && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Формат представления</label>
              <select
                value={settings.format}
                onChange={(e) =>
                  updateSetting(
                    "format",
                    e.target.value as "paragraphs" | "list",
                  )
                }
              >
                <option value="paragraphs">Связный текст (абзацы)</option>
                <option value="list">Маркированный список</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
