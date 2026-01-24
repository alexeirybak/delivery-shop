import { Brain, X } from "lucide-react";

import { ConnectionStatus } from "./ConnectionStatus";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { CustomPromptInput } from "./CustomPromptInput";
import { FooterStatus } from "./FooterStatus";
import { AIMenuModalProps } from "../../../../types";

export const TextAIMenuModal = ({
  isOpen,
  onClose,
  editor,
  onTestAPIAction,
  onQuickAction,
  onCustomPromptAction,
  isGenerating,
  aiStatus,
  errorDetails,
  customPrompt,
  onCustomPromptChange,
}: AIMenuModalProps) => {
  if (!isOpen) return null;

  const selectedText =
    editor && !editor.state.selection.empty
      ? editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          " ",
        )
      : "";

  return (
    <div
      className="fixed inset-0 bg-green-950 flex items-center justify-center z-9999 p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-red-50 to-yellow-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-red-600" />
              YandexGPT Помощник
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                RU Рабочий режим
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg duration-300 cursor-pointer"
            disabled={isGenerating}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <ConnectionStatus
            onTestAPI={onTestAPIAction}
            isGenerating={isGenerating}
          />

          <QuickActionsPanel
            onActionClick={onQuickAction}
            isGenerating={isGenerating}
          />

          <CustomPromptInput
            prompt={customPrompt}
            onChange={onCustomPromptChange}
            disabled={isGenerating}
          />
        </div>

        <FooterStatus
          selectedText={selectedText}
          aiStatus={aiStatus}
          errorDetails={errorDetails}
          onCancel={onClose}
          onSubmit={() => onCustomPromptAction(customPrompt)}
          isGenerating={isGenerating}
          isSubmitDisabled={!customPrompt.trim()}
        />
      </div>
    </div>
  );
};
