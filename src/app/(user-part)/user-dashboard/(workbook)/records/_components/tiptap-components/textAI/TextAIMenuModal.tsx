import { Brain, X } from "lucide-react";
import { FooterStatus } from "./FooterStatus";
import { CustomPromptInput } from "./CustomPromptInput";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { ConnectionStatus } from "./ConnectionStatus";
import { AIMenuModalProps } from "../../../types";
import { useState } from "react";
import { translateLanguages } from "../../../utils/translateLanguages";
import { languageMap } from "../../../utils/languageMap";
import "../../../styles/text-ai-menu-modal.css";

export const TextAIMenuModal = ({
  isOpen,
  onClose,
  isGenerating,
  aiStatus,
  selectedText,
  customPrompt,
  onCustomPromptChange,
  onQuickAction,
  onCustomPromptAction,
  onTestAPIAction,
  errorDetails,
}: AIMenuModalProps) => {
  const [targetLanguage, setTargetLanguage] = useState("русский");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleQuickAction = (actionId: string) => {
    if (actionId === "translate") {
      if (!selectedText.trim()) {
        alert("Выделите текст для перевода");
        return;
      }
      setShowLanguageSelector(true);
    } else {
      onQuickAction(actionId);
    }
  };

  const handleTranslateWithLanguage = () => {
    setShowLanguageSelector(false);
    const englishLang = languageMap[targetLanguage] || targetLanguage;

    let sourceLanguage = "auto";
    const arabicPattern =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    if (arabicPattern.test(selectedText)) {
      sourceLanguage = "Arabic";
    }

    const enhancedPrompt =
      sourceLanguage === "Arabic"
        ? `Translate the following Arabic text to ${englishLang}. Preserve the meaning and style:\n\n${selectedText}`
        : `Translate to ${englishLang}:\n\n${selectedText}`;

    onQuickAction("translate", enhancedPrompt);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="text-ai-modal-overlay">
        <div className="text-ai-modal-container">
          <div className="text-ai-modal-header">
            <div className="text-ai-modal-title">
              <h2>
                <Brain />
                AI-помощник
              </h2>
              <span className="text-ai-badge">Рабочий режим</span>
            </div>
            <button
              onClick={onClose}
              className="text-ai-modal-close"
              disabled={isGenerating}
            >
              <X />
            </button>
          </div>

          <div className="text-ai-modal-body">
            <ConnectionStatus
              onTestAPI={onTestAPIAction}
              isGenerating={isGenerating}
            />
            <QuickActionsPanel
              onActionClick={handleQuickAction}
              isGenerating={isGenerating}
            />
            <CustomPromptInput
              prompt={customPrompt}
              onChange={onCustomPromptChange}
              disabled={isGenerating}
            />
          </div>

          <FooterStatus
            aiStatus={aiStatus}
            selectedText={selectedText}
            onCancel={onClose}
            isGenerating={isGenerating}
            onSubmit={() => onCustomPromptAction(customPrompt)}
            isSubmitDisabled={!customPrompt.trim()}
            errorDetails={errorDetails}
          />
        </div>
      </div>

      {showLanguageSelector && (
        <div className="language-selector-overlay">
          <div className="language-selector-modal">
            <h3>Выберите язык перевода</h3>
            <div className="language-list">
              {translateLanguages.map((lang) => (
                <button
                  key={lang.value}
                  className={`language-btn ${
                    targetLanguage === lang.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setTargetLanguage(lang.value);
                    handleTranslateWithLanguage();
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              className="language-cancel-btn"
              onClick={() => setShowLanguageSelector(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </>
  );
};
