import {
  HelpCircle,
  X,
  MousePointer,
  PenTool,
  Layout,
  Save as SaveIcon,
  FileJson,
  Monitor,
  Plus,
  Edit2,
  Trash2,
  Save,
} from "lucide-react";

interface HelpGuideProps {
  onClose: () => void;
}

export const HelpGuide = ({ onClose }: HelpGuideProps) => {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-content" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>
            <HelpCircle size={24} /> Помощь
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="help-sections">
          <div className="help-section">
            <h3>
              <MousePointer size={16} /> Навигация
            </h3>
            <ul>
              <li>Клик на этап - выделить</li>
              <li>Клик на текст - редактировать</li>
              <li>Стрелки - прокрутка Timeline</li>
            </ul>
          </div>
          <div className="help-section">
            <h3>
              <PenTool size={16} /> Действия
            </h3>
            <ul>
              <li>
                <Plus size={12} /> - добавить этап/задачу
              </li>
              <li>
                <Edit2 size={12} /> - редактировать
              </li>
              <li>
                <Trash2 size={12} /> - удалить
              </li>
            </ul>
          </div>
          <div className="help-section">
            <h3>
              <Layout size={16} /> Виды
            </h3>
            <ul>
              <li>Timeline - временная линия</li>
              <li>Gantt - диаграмма Ганта</li>
              <li>Cards - карточки</li>
            </ul>
          </div>
          <div className="help-section">
            <h3>
              <SaveIcon size={16} /> Экспорт
            </h3>
            <ul>
              <li>
                <FileJson size={12} /> JSON - скачать данные
              </li>
              <li>
                <Monitor size={12} /> Полный экран
              </li>
              <li>
                <Save size={12} /> Сохранить изменения
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
