import { Plus, PanelRightOpen, Mic } from "lucide-react";
import { ChatHeaderProps } from "../../types";
import "../../styles/chat-header.css";

export const ChatHeader = ({ onNewChat, onToggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button
          onClick={onToggleSidebar}
          className="menu-btn"
          title="Открыть меню"
        >
          <PanelRightOpen size={32} />
        </button>
        <Mic size={32} className="header-icon" />
        <div>
          <h1>AI-ассистент работы со звуком</h1>
          <p>
            Диктовка, транскрибация аудиофайлов и преобразование текста в речь.
            Голосовой ввод с автоматическим форматированием, распознавание речи
            из файлов и синтез речи с возможностью скачивания MP3.
          </p>
        </div>
      </div>
      <div className="chat-header-actions">
        <button onClick={onNewChat} className="new-chat-btn" title="Новый чат">
          <Plus size={18} />
          <span>Новый</span>
        </button>
      </div>
    </div>
  );
};
