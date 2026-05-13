import { stats } from "@/utils/stats";
import "./stats.css";

export const Stats = () => (
  <section className="stats" aria-label="Метрики платформы">
    {stats.map((stat) => (
      <article
        className="stat-card reveal reveal-4"
        data-scroll
        key={stat.label}
      >
        <strong>{stat.value}</strong>
        <span>{stat.label}</span>
      </article>
    ))}
  </section>
);
