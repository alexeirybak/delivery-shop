import { useState } from "react";
import { ChevronDown, ChevronUp, Users, Settings2 } from "lucide-react";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import { useRoleplaySettingsStore } from "@/store/roleplaySettingsStore";

export const RoleplaySettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useRoleplaySettingsStore();

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
      title="Параметры ролевой игры"
      buttonLabel="Параметры игры"
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
            <Users size={16} />
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
              <label>Сложность</label>
              <select
                value={settings.difficulty}
                onChange={(e) =>
                  updateSetting(
                    "difficulty",
                    e.target.value as "beginner" | "intermediate" | "expert",
                  )
                }
              >
                <option value="beginner">Новичок (простые ситуации)</option>
                <option value="intermediate">
                  Средний (реалистичные сценарии)
                </option>
                <option value="expert">
                  Эксперт (сложные многовариантные ситуации)
                </option>
              </select>
              <span className="settings-hint">
                Определяет сложность ситуаций и последствий
              </span>
            </div>

            <div className="settings-field">
              <label>Количество вариантов выбора</label>
              <select
                value={settings.maxChoices}
                onChange={(e) =>
                  updateSetting("maxChoices", parseInt(e.target.value))
                }
              >
                <option value="2">2 варианта</option>
                <option value="3">3 варианта</option>
                <option value="4">4 варианта</option>
                <option value="5">5 вариантов</option>
              </select>
              <span className="settings-hint">
                Сколько вариантов действий будет предложено
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
              <label>Показывать метрики</label>
              <select
                value={settings.includeMetrics ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting("includeMetrics", e.target.value === "yes")
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Отображать бюджет, время, репутацию и другие показатели
              </span>
            </div>

            <div className="settings-field">
              <label>Показывать последствия</label>
              <select
                value={settings.showConsequences ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting("showConsequences", e.target.value === "yes")
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Показывать детальное описание последствий выбора
              </span>
            </div>

            <div className="settings-field">
              <label>История решений</label>
              <select
                value={settings.includeHistory ? "yes" : "no"}
                onChange={(e) =>
                  updateSetting("includeHistory", e.target.value === "yes")
                }
              >
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <span className="settings-hint">
                Показывать историю принятых решений
              </span>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
