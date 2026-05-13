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
          <h1>AI-генератор письменных работ</h1>
          <p>
            Создавайте любые письменные работы: от эссе до диплома. Выберите тип
            работы, задайте тему и параметры — и получите структурированный
            материал высокого качества. Идеально для студентов, преподавателей и
            всех, кто занимается академическим письмом!
          </p>
        </div>
      </div>
      <div className="chat-header-actions">
        <button
          onClick={onNewChat}
          className="new-chat-btn"
          title="Новая работа"
        >
          <Plus size={18} />
          <span>Новая работа</span>
        </button>
      </div>
    </div>
  );
};
