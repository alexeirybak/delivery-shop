"use client";

import { useState, useEffect } from "react";
import "./demoSection.css";
import { generationFormats, pipelineSteps } from "./pipelineSteps";

export const DemoSection = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedStep, setTypedStep] = useState("");
  const [activeFormatIndex, setActiveFormatIndex] = useState(0);

  const activeFormat =
    generationFormats[activeFormatIndex] || generationFormats[0];
  const currentStep = pipelineSteps[stepIndex] || pipelineSteps[0];

  useEffect(() => {
    const fullText = currentStep.description;
    let timeoutId: NodeJS.Timeout;

    if (typedStep.length < fullText.length) {
      timeoutId = setTimeout(() => {
        setTypedStep(fullText.slice(0, typedStep.length + 1));
      }, 40);
    } else {
      timeoutId = setTimeout(() => {
        setTypedStep("");
        setStepIndex((current) => (current + 1) % pipelineSteps.length);
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [stepIndex, typedStep, currentStep.description]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFormatIndex(
        (current) => (current + 1) % generationFormats.length,
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="demo-section reveal reveal-6" id="demo" data-scroll>
      <div className="demo-copy">
        <p className="eyebrow">Как работает AI-пайплайн</p>
        <h2>Одна тема — 35+ форматов контента</h2>
        <p>
          Структуры курсов, ментальные карты, глоссарии, карточки, ролевые игры,
          научные статьи — нейросеть генерирует всё, что нужно для полноценного
          образовательного процесса. Выбирайте тип, настраивайте параметры и
          получайте готовый материал за секунды.
        </p>
      </div>

      <div className="telemetry-grid">
        <article className="telemetry-card telemetry-video-card">
          <div className="demo-visualization">
            <div className="visualization-sphere">
              <div className="sphere-core" />
              <div className="sphere-ring ring-1" />
              <div className="sphere-ring ring-2" />
              <div className="sphere-ring ring-3" />
              <div className="sphere-particles">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      transform: `rotate(${i * 15}deg) translateY(-80px)`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="visualization-labels">
              <span className="label label-1">Лекции</span>
              <span className="label label-2">Практика</span>
              <span className="label label-3">Тесты</span>
              <span className="label label-4">Визуализация</span>
              <span className="label label-5">Зачеты</span>
              <span className="label label-6">Экзамены</span>
              <span className="label label-7">Озвучивание</span>
              <span className="label label-8">Научные статьи</span>
              <span className="label label-9">Ролевые игры</span>
              <span className="label label-10">Глоссарий</span>
              <span className="label label-12">Психолог</span>
            </div>
          </div>
        </article>

        <article className="telemetry-card telemetry-terminal">
          <div className="telemetry-top">
            <span className="telemetry-badge">
              <span className="telemetry-dot" />
              AI Pipeline
            </span>
            <span className="telemetry-caption">Генерация контента</span>
          </div>
          <p className="telemetry-output">
            {typedStep}
            <span className="telemetry-caret" />
          </p>
          <div className="telemetry-block">
            {pipelineSteps.map((step) => (
              <div className="telemetry-row" key={step.name}>
                <span>
                  <step.icon
                    size={16}
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      color: step.color,
                    }}
                  />
                  {step.name}
                </span>
                <span>{step.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="telemetry-card scheduler-card">
          <div className="telemetry-top">
            <span className="telemetry-caption">Форматы</span>
            <span className="telemetry-caption">{activeFormat.category}</span>
          </div>
          <div className="scheduler-grid">
            {generationFormats.map((format, index) => (
              <div
                key={format.name}
                className={`scheduler-cell ${index === activeFormatIndex ? "scheduler-active" : ""} ${format.active ? "scheduler-enabled" : ""}`}
              >
                <p>
                  <format.icon size={24} style={{ color: format.color }} />
                </p>
                <span>{format.name}</span>
              </div>
            ))}
          </div>
          <p className="scheduler-status">
            активный формат: {activeFormat.name} — {activeFormat.description}
          </p>
        </article>
      </div>
    </section>
  );
};
