import { useCallback } from "react";
import { VoiceInput } from "../../_components/VoiceInput";
import { TextArea } from "../../_components/TextArea";
import { SendButton } from "../../_components/SendButton";
import { Plus, X } from "lucide-react";
import { ChatInputProps } from "../../types";
import { FilePreview } from "../../_components/FilePreview";
import { ImageUploadButton } from "../../_components/ImageUploadButton";
import { FileUploadButton } from "../../_components/FileUploadButton";
import { ImagePreview } from "../../_components/ImagePreview";
import "../../styles/chat-input.css";

export const ChatInput = ({
  input,
  setInput,
  images = [],
  onImagesChange,
  file,
  onFileChange,
  isGenerating,
  onSend,
  onStop,
  placeholder,
  disabled = false,
  onNewChat,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSend();
      }
    }
  };

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      setInput(input + (input ? " " : "") + text);
    },
    [input, setInput],
  );

  const removeImage = useCallback(
    (index: number) => {
      if (onImagesChange) {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
      }
    },
    [images, onImagesChange],
  );

  const removeFile = useCallback(() => {
    if (onFileChange) {
      onFileChange(null);
    }
  }, [onFileChange]);

  const hasContent = input.trim().length > 0 || images.length > 0 || !!file;

  const handleClearInput = useCallback(() => {
    setInput("");
  }, [setInput]);

  return (
    <div className="chat-input">
      <div className="input-wrapper">
        <div className="buttons-wrapper">
          <button
            onClick={onNewChat}
            className="new-chat-bottom-btn"
            title="Новый чат"
          >
            <Plus size={18} />
            <span>Новый чат</span>
          </button>
        </div>
        <div className="textarea-wrapper">
          <TextArea
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <div className="actions-overlay">
          <SendButton
            isGenerating={isGenerating}
            onSend={onSend}
            onStop={onStop}
            disabled={disabled}
            hasContent={hasContent}
          />
          <div className="actions-group">
            <div className="action-group-row">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                disabled={isGenerating}
              />
              <ImageUploadButton
                images={images}
                onImagesChange={onImagesChange || (() => {})}
                disabled={isGenerating}
              />
            </div>
            <div className="action-group-row">
              <FileUploadButton
                onFileChange={onFileChange || (() => {})}
                disabled={isGenerating}
              />
              <button
                onClick={handleClearInput}
                className="clear-input-btn"
                title="Очистить текст"
                type="button"
                disabled={!input}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
        {(images.length > 0 || file) && (
          <div className="preview-wrapper">
            {images.length > 0 && (
              <ImagePreview images={images} onRemove={removeImage} />
            )}
            {file && <FilePreview file={file} onRemove={removeFile} />}
          </div>
        )}
      </div>
    </div>
  );
};
