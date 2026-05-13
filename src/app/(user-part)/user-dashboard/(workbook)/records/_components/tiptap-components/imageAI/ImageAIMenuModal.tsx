import { Footer } from "./Footer";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { ImageAIModalProps } from "../../../types";
import "../../../styles/image-ai-menu-modal.css";

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
    <div className="image-ai-modal-overlay">
      <div className="image-ai-modal-container">
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
          prompt={prompt}
          onCloseClick={onCloseClick}
          onInsertToEditor={onInsertToEditor}
          onGenerateImage={onGenerateImage}
        />
      </div>
    </div>
  );
};
