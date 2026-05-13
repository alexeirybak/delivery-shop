import { HeroPanelText } from "./HeroPanelText";
import { ReactNode } from "react";
import "./hero.css";

export const Hero = ({ children }: { children?: ReactNode }) => {
  return (
    <section className="hero-section reveal reveal-3">
      <div className="hero-copy">
        <p className="eyebrow">Платформа обучения и проведения научных исследований нового поколения</p>
        <h1>
          Конструктор образовательного и научного контента на ИИ
        </h1>
        <p className="lede">
          Генерируйте учебные и научные материалы любого типа: от рабочих тетрадей и лекций до ментальных карт, интерактивных уроков, ролевых игр, аудио, черновиков научных статей. Всё — в единой цифровой среде без ручной сборки.
        </p>

        <div className="hero-meta">
          <div className="meta-block">
            <span className="meta-label">Для кого</span>
            <strong>Преподаватели, авторы курсов, студенты, слушатели, аспиранты, соискатели</strong>
          </div>
          <div className="meta-block">
            <span className="meta-label">Результат</span>
            <strong>Готовые учебные и научные материалы за секунды</strong>
          </div>
        </div>
      </div>

      <aside className="hero-panel">
        <HeroPanelText />
        {children}
      </aside>
    </section>
  );
};