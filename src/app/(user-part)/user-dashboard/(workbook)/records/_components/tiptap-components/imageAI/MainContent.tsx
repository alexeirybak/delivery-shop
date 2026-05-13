import { MainContentProps } from "../../../types";
import { ApiInfoAlert } from "./ApiInfoAlert";
import { ErrorPanel } from "./ErrorPanel";
import { PromptSection } from "./PromptSection";
import { ResultPanel } from "./ResultPanel";
import { SettingsPanel } from "./SettingsPanel";
import { StatusPanel } from "./StatusPanel";
import "../../../styles/main-content.css";

export const MainContent = ({
  apiInfo,
  prompt,
  isGenerating,
  selectedAspect,
  selectedStyle,
  elapsedSeconds,
  generation,
  onAspectChange,
  onStyleChange,
  onAspectButtonClick,
  onStyleButtonClick,
  onPromptChange,
  onDownload,
  onInsertToEditor,
}: MainContentProps) => {
  return (
    <div className="main-content">
      <ApiInfoAlert apiInfo={apiInfo} />
      <PromptSection
        prompt={prompt}
        onPromptChange={onPromptChange}
        isGenerating={isGenerating}
      />
      <SettingsPanel
        selectedAspect={selectedAspect}
        selectedStyle={selectedStyle}
        onAspectChange={onAspectChange}
        onStyleChange={onStyleChange}
        onAspectButtonClick={onAspectButtonClick}
        onStyleButtonClick={onStyleButtonClick}
        isGenerating={isGenerating}
      />
      {isGenerating && (
        <StatusPanel
          status={generation.status}
          elapsedSeconds={elapsedSeconds}
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