import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  FileText,
  Languages,
  BookOpen,
  Ruler,
  Library,
  Hash,
} from "lucide-react";
import { useScientificArticleSettingsStore } from "@/store/scientificArticleSettingsStore";
import { ScientificArticleSettingsPanelProps } from "../types";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/scientific-article-settings.css";

export const ScientificArticleSettingsPanel = ({
  model = "deepseek",
  onModelChange,
}: ScientificArticleSettingsPanelProps) => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useScientificArticleSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    abstract: true,
    keywords: false,
    volume: true,
    references: false,
    indexes: false,
    modelSelector: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Настройки научной статьи"
      buttonLabel="Настройки статьи"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("modelSelector")}
        >
          <h4>Режим AI-помощника</h4>
          {expandedSections.modelSelector ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.modelSelector && (
          <div className="settings-section-content">
            <div className="model-buttons-horizontal">
              <button
                className={`model-btn-horizontal ${model === "deepseek" ? "active" : ""}`}
                onClick={() => onModelChange?.("deepseek")}
              >
                <div className="model-info">
                  <Zap size={20} />
                  <div className="model-badge">Гуманитарный</div>
                </div>
                <div className="model-desc">
                  Рекомендуется для задач, требующих глубокого понимания
                  текста, анализа литературных произведений, философских и
                  социальных тем
                </div>
              </button>

              <button
                className={`model-btn-horizontal ${model === "qwen" ? "active" : ""}`}
                onClick={() => onModelChange?.("qwen")}
              >
                <div className="model-info">
                  <Brain size={20} />
                  <div className="model-badge premium">Технический</div>
                </div>
                <div className="model-desc">
                  Рекомендуется для анализа и генерации в корпоративных и
                  научных текстах, технических документах, статьях в области
                  STEM
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("abstract")}
        >
          <h4>Аннотация</h4>
          {expandedSections.abstract ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.abstract && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeAbstract}
                onChange={(e) =>
                  updateSetting("includeAbstract", e.target.checked)
                }
              />
              <FileText size={14} className="checkbox-icon" />
              <span>Включить аннотацию</span>
            </label>

            {settings.includeAbstract && (
              <>
                <div className="settings-slider">
                  <label>
                    Объем аннотации:{" "}
                    <strong>{settings.abstractLength}</strong> слов
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={settings.abstractLength}
                    onChange={(e) =>
                      updateSetting(
                        "abstractLength",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <label className="settings-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.includeEnglishAbstract}
                    onChange={(e) =>
                      updateSetting(
                        "includeEnglishAbstract",
                        e.target.checked,
                      )
                    }
                  />
                  <Languages size={14} className="checkbox-icon" />
                  <span>Аннотация на английском</span>
                </label>
              </>
            )}
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("keywords")}
        >
          <h4>Ключевые слова</h4>
          {expandedSections.keywords ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.keywords && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeKeywords}
                onChange={(e) =>
                  updateSetting("includeKeywords", e.target.checked)
                }
              />
              <Hash size={14} className="checkbox-icon" />
              <span>Включить ключевые слова</span>
            </label>

            {settings.includeKeywords && (
              <>
                <div className="settings-slider">
                  <label>
                    Количество: <strong>{settings.keywordsCount}</strong>{" "}
                    слов
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={settings.keywordsCount}
                    onChange={(e) =>
                      updateSetting(
                        "keywordsCount",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <label className="settings-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.includeEnglishKeywords}
                    onChange={(e) =>
                      updateSetting(
                        "includeEnglishKeywords",
                        e.target.checked,
                      )
                    }
                  />
                  <Languages size={14} className="checkbox-icon" />
                  <span>Ключевые слова на английском</span>
                </label>
              </>
            )}
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("volume")}
        >
          <h4>Объем статьи</h4>
          {expandedSections.volume ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.volume && (
          <div className="settings-section-content">
            <div className="settings-slider">
              <label>
                <Ruler size={14} className="inline-icon" />
                <strong>
                  {settings.articleLength.toLocaleString()}
                </strong>{" "}
                знаков ({(settings.articleLength / 40000).toFixed(2)} п/л)
              </label>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={settings.articleLength}
                onChange={(e) =>
                  updateSetting("articleLength", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("references")}
        >
          <h4>Список литературы</h4>
          {expandedSections.references ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.references && (
          <div className="settings-section-content">
            <div className="settings-slider">
              <label>
                <Library size={14} className="inline-icon" />
                Количество источников:{" "}
                <strong>{settings.referencesCount}</strong>{" "}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={settings.referencesCount}
                onChange={(e) =>
                  updateSetting("referencesCount", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("indexes")}
        >
          <h4>Индексы</h4>
          {expandedSections.indexes ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.indexes && (
          <div className="settings-section-content">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeUdk}
                onChange={(e) =>
                  updateSetting("includeUdk", e.target.checked)
                }
              />
              <BookOpen size={14} className="checkbox-icon" />
              <span>Добавить УДК</span>
            </label>

            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeBbk}
                onChange={(e) =>
                  updateSetting("includeBbk", e.target.checked)
                }
              />
              <Library size={14} className="checkbox-icon" />
              <span>Добавить ББК</span>
            </label>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};