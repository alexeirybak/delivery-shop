import { Sparkles, Plus, PanelRightOpen } from "lucide-react";
import { ChatHeaderProps } from "../../types";
import "../../styles/chat-header.css";

export const ChatHeader = ({ onNewChat, onToggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button onClick={onToggleSidebar} className="menu-btn" title="Открыть меню">
          <PanelRightOpen size={32} />
        </button>
        <Sparkles size={32} className="header-icon" />
        <div>
          <h1>AI-ассистент учащегося</h1>
          <p>
            Помощь в освоении материала, решении задач, подготовке к экзаменам 
            и объяснении сложных тем. Задайте вопрос — получите понятное объяснение.
          </p>
        </div>
      </div>
      <div className="chat-header-actions">
        <button onClick={onNewChat} className="new-chat-btn" title="Новый чат">
          <Plus size={18} />
          <span>Новый чат</span>
        </button>
      </div>
    </div>
  );
};