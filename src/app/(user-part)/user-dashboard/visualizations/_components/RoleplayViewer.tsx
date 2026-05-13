import { useState } from "react";
import { Users, RotateCcw, Briefcase, Clock, Star, TrendingUp, Heart } from "lucide-react";
import { RoleplayChoice, RoleplayHistory, RoleplayScenario } from "../types/visualizations.types";
import '../styles/roleplay-viewer.css'

interface RoleplayViewerProps {
  data: RoleplayScenario;
  onClose?: () => void;
  onSave?: (data: RoleplayScenario) => void;
  isSaving?: boolean;
}

export const RoleplayViewer = ({ data, onSave }: RoleplayViewerProps) => {
  const [scenario, setScenario] = useState<RoleplayScenario>(data);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const history = scenario.history || [];
  const choices = scenario.choices || [];
  const stats = scenario.stats || {};

  const currentSituation = history.length === 0
    ? scenario.situation
    : history[history.length - 1].consequences;

  const currentStats = history.length === 0
    ? stats
    : history[history.length - 1].statsAfter;

  const getStatIcon = (key: string) => {
    switch (key) {
      case "budget": return <Briefcase size={14} />;
      case "time": return <Clock size={14} />;
      case "morale": return <Star size={14} />;
      case "reputation": return <TrendingUp size={14} />;
      case "health": return <Heart size={14} />;
      default: return null;
    }
  };

  const getStatLabel = (key: string) => {
    switch (key) {
      case "budget": return "Бюджет";
      case "time": return "Время";
      case "morale": return "Мораль";
      case "reputation": return "Репутация";
      case "health": return "Здоровье";
      default: return key;
    }
  };

  const handleMakeChoice = async (choice: RoleplayChoice) => {
    setIsProcessing(true);
    setSelectedChoice(choice.id);

    await new Promise(resolve => setTimeout(resolve, 500));

    const newHistory: RoleplayHistory = {
      step: history.length + 1,
      situation: currentSituation,
      userChoice: choice.text,
      consequences: choice.consequences,
      statsAfter: {
        budget: (currentStats.budget || 0) + (choice.impact.budget || 0),
        time: (currentStats.time || 0) + (choice.impact.time || 0),
        morale: (currentStats.morale || 0) + (choice.impact.morale || 0),
        reputation: (currentStats.reputation || 0) + (choice.impact.reputation || 0),
        health: (currentStats.health || 0) + (choice.impact.health || 0),
      },
    };

    const updatedScenario = {
      ...scenario,
      history: [...history, newHistory],
      stats: newHistory.statsAfter,
    };

    setScenario(updatedScenario);
    setSelectedChoice(null);
    setIsProcessing(false);

    if (onSave) {
      onSave(updatedScenario);
    }
  };

  const handleReset = () => {
    setScenario(data);
    setSelectedChoice(null);
  };

  // Если нет вариантов выбора, показываем сообщение
  if (choices.length === 0) {
    return (
      <div className="roleplay-viewer">
        <div className="roleplay-header">
          <div className="roleplay-title">
            <Users size={20} />
            <div>
              <h3>{scenario.title}</h3>
              {scenario.description && <p>{scenario.description}</p>}
            </div>
          </div>
        </div>
        <div className="roleplay-scenario">
          <div className="roleplay-role-badge">Роль: {scenario.role}</div>
          <div className="roleplay-situation">{scenario.situation}</div>
        </div>
        <p className="roleplay-no-choices">Нет доступных вариантов действий</p>
      </div>
    );
  }

  return (
    <div className="roleplay-viewer">
      <div className="roleplay-header">
        <div className="roleplay-title">
          <Users size={20} />
          <div>
            <h3>{scenario.title}</h3>
            {scenario.description && <p>{scenario.description}</p>}
          </div>
        </div>
        <button onClick={handleReset} className="roleplay-reset-btn" title="Начать заново">
          <RotateCcw size={16} />
          <span>Сбросить</span>
        </button>
      </div>

      <div className="roleplay-stats">
        {Object.entries(currentStats).map(([key, value]) => (
          <div key={key} className="roleplay-stat">
            {getStatIcon(key)}
            <span className="stat-label">{getStatLabel(key)}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="roleplay-scenario">
        <div className="roleplay-role-badge">Роль: {scenario.role}</div>
        <div className="roleplay-situation">{currentSituation}</div>
      </div>

      <div className="roleplay-choices">
        <h4>Ваши действия:</h4>
        <div className="choices-grid">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleMakeChoice(choice)}
              disabled={isProcessing || selectedChoice === choice.id}
              className={`roleplay-choice-btn ${selectedChoice === choice.id ? "processing" : ""}`}
            >
              {choice.text}
              {selectedChoice === choice.id && <span className="loading-spinner" />}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="roleplay-history">
          <h4>История решений</h4>
          <div className="history-list">
            {history.slice(-3).reverse().map((item, idx) => (
              <div key={idx} className="history-item">
                <div className="history-step">Шаг {item.step}</div>
                <div className="history-choice">Вы: {item.userChoice}</div>
                <div className="history-consequence">{item.consequences}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};