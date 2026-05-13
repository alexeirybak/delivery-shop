import { Volume2, Globe } from "lucide-react";
import {
  useTextToAudioSettingsStore,
  TEXT_TO_AUDIO_VOICES,
  TextToAudioLanguage,
} from "@/store/textToAudioSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/text-to-audio-settings.css";

export const TextToAudioSettingsPanel = () => {
  const {
    settings,
    setVoice,
    setLanguage,
    setSpeed,
    setShowSettings,
    resetSettings,
  } = useTextToAudioSettingsStore();
  const showSettings = settings.showSettings;

  return (
    <SettingsPanelLayout
      title="Настройки голоса"
      buttonLabel="Настройки голоса"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-header-left">
            <Globe size={16} />
            <h4>Язык</h4>
          </div>
        </div>
        <div className="settings-section-content">
          <div className="settings-field">
            <select
              value={settings.language}
              onChange={(e) =>
                setLanguage(e.target.value as TextToAudioLanguage)
              }
            >
              <option value="ru-RU">🇷🇺 Русский</option>
              <option value="en-US">🇺🇸 English</option>
              <option value="de-DE">🇩🇪 Deutsch</option>
              <option value="kk-KK">🇰🇿 Қазақша</option>
              <option value="uz-UZ">🇺🇿 O‘zbekcha</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-header-left">
            <Volume2 size={16} />
            <h4>Голос</h4>
          </div>
        </div>
        <div className="settings-section-content">
          <div className="voice-list">
            {TEXT_TO_AUDIO_VOICES.filter(
              (v) => v.language === settings.language,
            ).map((voice) => (
              <button
                key={voice.id}
                onClick={() => setVoice(voice.id)}
                className={`voice-option ${settings.voiceId === voice.id ? "active" : ""}`}
              >
                <div className="voice-option-icon">
                  <Volume2 size={14} />
                </div>
                <div className="voice-option-info">
                  <div className="voice-option-name">{voice.name}</div>
                  <div className="voice-option-desc">
                    {voice.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-header-left">
            <Volume2 size={16} />
            <h4>Скорость речи</h4>
          </div>
        </div>
        <div className="settings-section-content">
          <div className="settings-field">
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="speed-slider"
            />
            <div className="speed-labels">
              <span>Медленно</span>
              <span>{settings.speed}x</span>
              <span>Быстро</span>
            </div>
          </div>
        </div>
      </div>
    </SettingsPanelLayout>
  );
};