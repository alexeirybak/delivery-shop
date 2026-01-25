import { ImageAIModalProps } from "../../../../types";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";

export const ImageAIMenuModal = ({
  isOpen,
  prompt,
  generation,
  selectedAspect,
  selectedStyle,
  apiInfo,
  elapsedSeconds,
  onPromptChange,
  onAspectChange,
  onStyleChange,
  onTestAPI,
  onDownload,
  onInsertToEditor,
  onGenerateImage,
  onCloseClick,
  onSettingsButtonClick,
  onStyleButtonClick,
}: ImageAIModalProps) => {
  if (!isOpen) return null;

  const isGenerating = generation.status === "generating" || generation.status === "loading";

  return (
    <div className="fixed inset-0 bg-linear-to-br from-cyan-500 to-blue-700 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col cursor-default select-text">
        <Header
          onTestAPI={onTestAPI}
          onCloseClick={onCloseClick}
          isGenerating={isGenerating}
        />

        <MainContent
          apiInfo={apiInfo}
          prompt={prompt}
          onPromptChange={onPromptChange}
          selectedAspect={selectedAspect}
          selectedStyle={selectedStyle}
          onAspectChange={onAspectChange}
          onStyleChange={onStyleChange}
          disabled={isGenerating}
          onAspectButtonClick={onSettingsButtonClick}
          onStyleButtonClick={onStyleButtonClick}
          generation={generation}
          elapsedSeconds={elapsedSeconds}
          onDownload={onDownload}
          onInsertToEditor={onInsertToEditor}
        />

        <Footer
          generationStatus={generation.status}
          elapsedSeconds={elapsedSeconds}
          prompt={prompt}
          onCloseClick={onCloseClick}
          onInsertToEditor={onInsertToEditor}
          onGenerateImage={onGenerateImage}
        />
      </div>
    </div>
  );
};