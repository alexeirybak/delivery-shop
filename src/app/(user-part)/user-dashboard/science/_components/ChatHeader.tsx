import { PanelRightOpen, Plus, Sparkles } from "lucide-react";
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
        <Sparkles size={32} className="header-icon" />
        <div>
          <h1>AI-консультант по научным исследованиям</h1>
          <p>
            Помогаю формулировать гипотезы, анализировать методологию,
            структурировать научные работы и находить исследовательские пробелы.
            Задайте вопрос по вашей теме.
          </p>
        </div>
      </div>
      <div className="chat-header-actions">
        <button
          onClick={onNewChat}
          className="new-chat-btn"
          title="Новая статья"
        >
          <Plus size={18} />
          <span>Новая статья</span>
        </button>
      </div>
    </div>
  );
};
