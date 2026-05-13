import { Plus, PanelRightOpen, GitBranch } from "lucide-react";
import { ChatHeaderProps } from "../../types";
import "../../styles/chat-header.css";

export const ChatHeader = ({ onNewChat, onToggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button onClick={onToggleSidebar} className="menu-btn" title="Открыть меню">
          <PanelRightOpen size={32} />
        </button>
        <GitBranch size={32} className="header-icon" />
        <div>
          <h1>AI-визуализатор</h1>
          <p>
            Создавайте наглядные визуализации с помощью ИИ. Ментальные карты,
            блок-схемы, диаграммы, сетевые графы и другие графические представления
            данных. Введите тему — получите готовую визуализацию.
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