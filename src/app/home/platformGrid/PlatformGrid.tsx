"use client";

import { useState, useEffect } from "react";
import { pillars } from "@/utils/pillars";
import "./platformGrid.css";

export const PlatformGrid = () => {
  const [stackCards, setStackCards] = useState([...pillars]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStackCards((current) => {
        const next = [...current];
        next.push(next.shift()!);
        return next;
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="platform-grid" id="platform">
      <div className="stack-panel reveal reveal-5" data-scroll>
        <div className="stack-panel-head">
          <p className="eyebrow">Системный стек</p>
          <h2>
            AI адаптируется под вашу роль: наставник, коллега, ученый или психолог
          </h2>
        </div>
        <div className="card-stack">
          {stackCards.map((card, index) => {
            const originalIndex = pillars.findIndex(
              (p) => p.title === card.title,
            );

            return (
              <article
                key={card.title}
                className="stack-card"
                style={{
                  top: `${index * 18}px`,
                  transform: `scale(${1 - index * 0.05})`,
                  zIndex: stackCards.length - index,
                  opacity: 1 - index * 0.14,
                }}
              >
                <p className="stack-index">режим 0{originalIndex + 1}</p>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="feature-section">
        {pillars.map((pillar, index) => (
          <article
            className="feature-card reveal reveal-5"
            data-scroll
            key={pillar.title}
          >
            <span className="feature-index">0{index + 1}</span>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
