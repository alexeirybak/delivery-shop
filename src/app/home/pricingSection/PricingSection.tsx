import { pricing } from "../../../utils/pricing";
import { MagneticButton } from "../../shared/magneticButton/MagneticButton";
import "./pricingSection.css";

export const PricingSection = () => (
  <main className="pricing-section" id="pricing">
    <div className="pricing-container">
      <div className="pricing-header-content">
        <p className="pricing-eyebrow">Тарифная модель</p>
        <h2 className="pricing-heading">
          Тарифы для авторов, студий и крупных образовательных экосистем.
        </h2>
      </div>

      <div className="pricing-grid">
        {pricing.map((plan) => (
          <article
            className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""}`}
            key={plan.name}
          >
            {plan.popular && (
              <span className="pricing-badge">Самый популярный</span>
            )}

            <div className="pricing-header">
              <span className="pricing-name">{plan.name}</span>
              <div className="pricing-price-wrapper">
                <div className="pricing-price-container">
                  {plan.originalPrice && (
                    <span className="pricing-original">
                      {plan.originalPrice}
                    </span>
                  )}
                  <strong className="pricing-price">{plan.price}</strong>
                </div>
                {plan.period && (
                  <span className="pricing-period">{plan.period}</span>
                )}
              </div>
            </div>

            <p className="pricing-description">{plan.description}</p>

            <ul className="pricing-features">
              {plan.features.map((feature, index) => {
                const featureText =
                  typeof feature === "string" ? feature : feature.text;
                const featureDescription =
                  typeof feature === "string" ? undefined : feature.description;

                return (
                  <li
                    key={`${plan.name}-${index}`}
                    className="pricing-feature-item"
                  >
                    <span className="pricing-feature-bullet" />
                    <div className="pricing-feature-content">
                      <span className="pricing-feature-text">
                        {featureText}
                      </span>
                      {featureDescription && (
                        <span className="pricing-feature-description">
                          {featureDescription}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pricing-footer">
              <MagneticButton
                href={plan.link}
                variant={plan.popular ? "primary" : "secondary"}
              >
                {plan.cta || "Выбрать тариф"}
              </MagneticButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  </main>
);
