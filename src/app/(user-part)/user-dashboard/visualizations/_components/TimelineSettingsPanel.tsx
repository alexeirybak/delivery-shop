import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useTimelineSettingsStore } from "@/store/timelineSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const TimelineSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useTimelineSettingsStore();

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
      title="Параметры хронологии"
      buttonLabel="Параметры хронологии"
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
            <Calendar size={16} />
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
              <label>Максимальное количество событий</label>
              <select
                value={settings.maxEvents}
                onChange={(e) =>
                  updateSetting("maxEvents", parseInt(e.target.value))
                }
              >
                <option value="5">~5 событий</option>
                <option value="10">~10 событий</option>
                <option value="15">~15 событий</option>
                <option value="20">~20 событий</option>
                <option value="30">~30 событий</option>
              </select>
              <span className="settings-hint">
                Определяет, сколько событий будет сгенерировано
              </span>
            </div>

            <div className="settings-field">
              <label>Порядок сортировки</label>
              <select
                value={settings.sortOrder}
                onChange={(e) =>
                  updateSetting(
                    "sortOrder",
                    e.target.value as "asc" | "desc",
                  )
                }
              >
                <option value="asc">От старых к новым</option>
                <option value="desc">От новых к старым</option>
              </select>
              <span className="settings-hint">
                В каком порядке будут расположены события на шкале
              </span>
            </div>

            <div className="settings-field">
              <label>Формат даты</label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  updateSetting(
                    "dateFormat",
                    e.target.value as "full" | "monthYear" | "year",
                  )
                }
              >
                <option value="full">Полный (день, месяц, год)</option>
                <option value="monthYear">Месяц, год</option>
                <option value="year">Только год</option>
              </select>
              <span className="settings-hint">
                Формат отображения дат в событиях
              </span>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};