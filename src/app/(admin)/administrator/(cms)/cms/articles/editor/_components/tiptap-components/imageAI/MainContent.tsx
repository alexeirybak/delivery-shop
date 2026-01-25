// MainContent.tsx
import { ApiInfoAlert } from "./ApiInfoAlert";
import { PromptSection } from "./PromptSection";
import { SettingsPanel } from "./SettingsPanel";
import { StatusPanel } from "./StatusPanel";
import { ErrorPanel } from "./ErrorPanel";
import { MainContentProps } from "../../../../types";
import ResultPanel from "./ResultPanel";

export const MainContent = ({
  apiInfo,
  prompt,
  onPromptChange,
  selectedAspect,
  selectedStyle,
  onAspectChange,
  onStyleChange,
  onAspectButtonClick,
  onStyleButtonClick,
  generation,
  elapsedSeconds,
  onDownload,
  onInsertToEditor,
}: MainContentProps) => {
  const isGenerating =
    generation.status === "generating" || generation.status === "loading";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <ApiInfoAlert apiInfo={apiInfo} />

      <PromptSection
        prompt={prompt}
        onPromptChange={onPromptChange}
        disabled={isGenerating}
      />

      <SettingsPanel
        selectedAspect={selectedAspect}
        selectedStyle={selectedStyle}
        onAspectChange={onAspectChange}
        onStyleChange={onStyleChange}
        disabled={isGenerating}
        onAspectButtonClick={onAspectButtonClick}
        onStyleButtonClick={onStyleButtonClick}
      />

      {isGenerating && (
        <StatusPanel
          status={generation.status}
          elapsedSeconds={elapsedSeconds}
          operationId={generation.operationId}
        />
      )}

      {generation.status === "success" && generation.imageUrl && (
        <ResultPanel
          imageUrl={generation.imageUrl}
          prompt={prompt}
          selectedStyle={selectedStyle}
          selectedAspect={selectedAspect}
          elapsedSeconds={elapsedSeconds}
          onDownload={onDownload}
          onInsertToEditor={onInsertToEditor}
        />
      )}

      {generation.status === "error" && generation.error && (
        <ErrorPanel error={generation.error} />
      )}
    </div>
  );
};
