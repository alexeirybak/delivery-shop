import { MailCheck } from "lucide-react";
import "./success-sent-email.css";

const SuccessSentEmail = ({ email }: { email: string }) => {
  return (
    <div className="success-container">
      <div className="success-header">
        <div className="success-icon">
          <MailCheck className="w-8 h-8" />
        </div>
        <h1 className="success-title">Проверьте Вашу почту</h1>
      </div>

      <p className="success-text">
        Если Вы <strong>регистрировались по email</strong> и аккаунт с email{" "}
        <strong className="success-email">{email}</strong> существует в нашей
        системе, мы отправили письмо с инструкциями по сбросу пароля.
      </p>

      <div className="success-tips">
        <h3 className="success-tips-title">Не получили письмо?</h3>
        <ul className="success-tips-list">
          <li>Проверьте папку «Спам» или «Нежелательная почта»</li>
          <li>Письмо может приходить с задержкой до 5-10 минут</li>
        </ul>
      </div>
    </div>
  );
};

export default SuccessSentEmail;
