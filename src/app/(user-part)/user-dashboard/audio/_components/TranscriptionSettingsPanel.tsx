import { Mic } from "lucide-react";
import {
  useTranscriptionSettingsStore,
  TRANSCRIPTION_LANGUAGES,
  TranscriptionLanguage,
} from "@/store/transcriptionSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/transcription-settings.css";

export const TranscriptionSettingsPanel = () => {
  const {
    settings,
    updateLanguage,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useTranscriptionSettingsStore();

  return (
    <SettingsPanelLayout
      title="Параметры распознавания"
      buttonLabel="Параметры распознавания"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-header-left">
            <Mic size={16} />
            <h4>Язык аудио</h4>
          </div>
        </div>

        <div className="settings-section-content">
          <div className="settings-field">
            <select
              value={settings.language}
              onChange={(e) =>
                updateLanguage(e.target.value as TranscriptionLanguage)
              }
            >
              {TRANSCRIPTION_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </SettingsPanelLayout>
  );
};
