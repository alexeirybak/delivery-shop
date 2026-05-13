import Image from "next/image";
import { archiveCards } from "../../../utils/archiveCards";
import "./archiveSection.css";

export const ArchiveSection = () => {
  return (
    <section className="archive-section" id="archive">
      <div className="section-heading reveal reveal-7" data-scroll>
        <p className="eyebrow">И куча других визуализаций по любому запросу</p>
        <h2>
          Генерируйте сложные визуализации простыми словами — нейросеть сама
          сделает то, что надо
        </h2>
      </div>

      <div className="archive-stack">
        {archiveCards.map((card, index) => (
          <article className="archive-card" key={card.title}>
            <div className="archive-copy">
              <p className="archive-label">{card.label}</p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>

            <div className="archive-visual">
              <div className="visual-container">
                {index === 0 && (
                  <Image
                    src="/images/radar-chart.png"
                    alt="Лепестковая диаграмма"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="chart-image"
                    priority
                  />
                )}
                {index === 1 && (
                  <Image
                    src="/images/pie-chart.png"
                    alt="Круговая диаграмма"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="chart-image"
                    priority
                  />
                )}
                {index === 2 && (
                  <Image
                    src="/images/line-chart.png"
                    alt="График"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="chart-image"
                    priority
                  />
                )}
              </div>
              <p className="artifact-label">{card.artifact}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};