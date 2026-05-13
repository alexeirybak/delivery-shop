import { Volume2 } from "lucide-react";
import { useVoiceSettingsStore, VOICES } from "@/store/voiceSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/voice-settings.css";

export const VoiceSettingsPanel = () => {
  const { settings, showSettings, setVoice, setShowSettings, resetSettings } =
    useVoiceSettingsStore();

  return (
    <SettingsPanelLayout
      title="Выберите психолога"
      buttonLabel="Выбор психолога"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="voice-categories">
        <div className="voice-category">
          <h5>Девушка</h5>
          <div className="voice-list">
            {VOICES.filter((v) => v.gender === "female").map((voice) => (
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
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="voice-category">
          <h5>Парень</h5>
          <div className="voice-list">
            {VOICES.filter((v) => v.gender === "male").map((voice) => (
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
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SettingsPanelLayout>
  );
};