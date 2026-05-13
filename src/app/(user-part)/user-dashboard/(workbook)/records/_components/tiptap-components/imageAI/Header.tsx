import { Palette, X, AlertCircle } from "lucide-react";
import { HeaderProps } from "../../../types";
import "../../../styles/image-header.css";

export const Header = ({
  onCloseClick,
  onTestAPI,
  isGenerating,
}: HeaderProps) => {
  return (
    <div className="image-header">
      <div className="image-header-left">
        <div className="image-header-title-wrapper">
          <Palette className="image-header-icon" />
          <h2 className="image-header-title">Генератор изображений</h2>
        </div>

        <span className="image-header-badge">AI ART</span>
      </div>
      <div className="image-header-right">
        <button
          type="button"
          onClick={onTestAPI}
          disabled={isGenerating}
          className="image-header-test-btn"
        >
          <AlertCircle />
          Тест API
        </button>
        <button
          onClick={onCloseClick}
          disabled={isGenerating}
          className="image-header-close"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
