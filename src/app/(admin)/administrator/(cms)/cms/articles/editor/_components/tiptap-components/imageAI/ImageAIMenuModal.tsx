import { ImageAIModalProps } from "../../../../types";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MainContent } from "./MainContent";

export const ImageAIMenuModal = ({
  isOpen,
  prompt,
  generation,
  selectedAspect,
  selectedStyle,
  apiInfo,
  elapsedSeconds,
  onTestAPI,
  onCloseClick,
  onPromptChange,
  onAspectChange,
  onStyleButtonClick,
  onStyleChange,
  onSettingsButtonClick,
  onDownload,
  onInsertToEditor,
  onGenerateImage,
}: ImageAIModalProps) => {
  if (!isOpen) return null;

  const isGenerating =
    generation.status === "generating" || generation.status === "loading";

  return (
    <div className="fixed inset-0 bg-linear-to-br from-cyan-500 to-blue-700 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col cursor-default select-text">
        <Header
          onCloseClick={onCloseClick}
          onTestAPI={onTestAPI}
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
          isGenerating={isGenerating}
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
