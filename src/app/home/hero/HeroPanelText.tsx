import { panelHighlights } from "@/utils/panelHighlights";

export const HeroPanelText = () => {
  return (
    <>
      <div className="panel-overlay" />

      <p className="panel-label">Алгоритм работы</p>

      <ul className="signal-list">
        <li>Выберите тип учебного или научного материала</li>
        <li>Настройте параметры генерации</li>
        <li>Получите готовый контент</li>
        <li>Скачайте в нужном формате</li>
      </ul>

      <div className="hero-panel-metrics">
        {panelHighlights.map((item) => (
          <div className="hero-panel-chip" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
};
