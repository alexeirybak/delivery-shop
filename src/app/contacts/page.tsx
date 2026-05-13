import "./styles/contacts.css";

const ContactPage = () => {
  return (
    <div className="contacts-page">
      <div className="contacts-content">
        <h1 className="contacts-title">Контакты</h1>

        <div className="contacts-sections">
          <div className="contacts-section">
            <h2 className="contacts-section-title">Социальные сети</h2>
            <div className="contacts-section-content">
              <ul className="contacts-list">
                <li className="contacts-list-item">
                  <strong>Telegram:</strong>{" "}
                  <a
                    href="https://t.me/alexeirybak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-link"
                  >
                    @alexeirybak
                  </a>
                </li>
                <li className="contacts-list-item">
                  <strong>VK:</strong>{" "}
                  <a
                    href="https://vk.com/alexeirybak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-link"
                  >
                    Алексей Рыбак
                  </a>
                </li>
                <li className="contacts-list-item">
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/alexeirybak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-link"
                  >
                    github.com/alexeirybak
                  </a>
                </li>
                <li className="contacts-list-item">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:your.email@example.com"
                    className="contacts-link"
                  >
                    a.ribak@narfu.ru
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="contacts-section">
            <h2 className="contacts-section-title">Обратная связь</h2>
            <div className="contacts-section-content">
              <p className="contacts-text">
                Я всегда открыт для новых возможностей, сотрудничества и
                интересных проектов. Если у вас есть вопросы или предложения —
                пишите!
              </p>
              <p className="contacts-text">
                Стараюсь отвечать в течение 24 часов в рабочие дни.
              </p>
            </div>
          </div>

          <div className="contacts-section">
            <h2 className="contacts-section-title">Open Source</h2>
            <div className="contacts-section-content">
              <p className="contacts-text">
                Многие мои проекты доступны на GitHub. Буду рад вашим звездам,
                форкам и pull request&apos;ам.
              </p>
              <ul className="contacts-list">
                <li className="contacts-list-item">Вклад в Next.js-проекты</li>
                <li className="contacts-list-item">
                  OpenID Connect интеграции
                </li>
                <li className="contacts-list-item">
                  AI-платформы и образовательные решения
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="contacts-footer">
          <p className="contacts-footer-text">
            © {new Date().getFullYear()} Лаборатория Нейродидактики — все права
            защищены
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
