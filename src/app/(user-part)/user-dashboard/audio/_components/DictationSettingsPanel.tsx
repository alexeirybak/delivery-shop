import { useState } from "react";
import { Mic, ChevronDown, ChevronUp } from "lucide-react";
import {
  useDictationSettingsStore,
  LANGUAGES,
  DictationLanguage,
} from "@/store/dictationSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/dictation-settings.css";

export const DictationSettingsPanel = () => {
  const {
    settings,
    updateLanguage,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useDictationSettingsStore();
  const [expanded, setExpanded] = useState(true);

  return (
    <SettingsPanelLayout
      title="Язык диктовки"
      buttonLabel="Язык диктовки"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="settings-section-header-left">
            <Mic size={16} />
            <h4>Выберите язык</h4>
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded && (
          <div className="settings-section-content">
            <div className="settings-field">
              <select
                value={settings.language}
                onChange={(e) =>
                  updateLanguage(e.target.value as DictationLanguage)
                }
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};