import { trustSignals } from "../../../utils/trustSignals";
import "./trustSignals.css";

const TrustSignals = () => {
  return (
    <section
      className="trust-section trust-bar reveal reveal-2"
      aria-label="Преимущества платформы"
    >
      {trustSignals.map((item, index) => (
        <span 
          className="trust-pill" 
          key={item}
          style={{ animationDelay: `${0.05 + index * 0.05}s` }}
        >
          {item}
        </span>
      ))}
    </section>
  );
};

export default TrustSignals;