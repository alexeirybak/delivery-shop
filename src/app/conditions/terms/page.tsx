import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Shield,
  AlertCircle,
} from "lucide-react";
import LogoSvg from "@/app/shared/logo/LogoSvg";
import "../../conditions/conditions.css";

export const metadata: Metadata = {
  title: "Условия использования | NeuroDidactica",
  description: "Правила и условия использования платформы NeuroDidactica",
};

export default function TermsPage() {
  return (
    <main className="register-page">
      <div className="register-glow" />

      <div className="terms-container">
        <div className="terms-header">
          <Link href="/auth/register" className="back-link">
            <ArrowLeft className="w-4 h-4" />
            Назад к регистрации
          </Link>
          <Link href="/" className="terms-logo">
            <LogoSvg />
            <span className="terms-logo-text">NeuroDidactica</span>
          </Link>
        </div>

        <div className="terms-content">
          <h1 className="terms-title">Условия использования</h1>
          <p className="terms-date">Последнее обновление: 18 марта 2026 г.</p>

          <div className="terms-section">
            <h2>
              <FileText className="w-5 h-5" />
              1. Общие положения
            </h2>
            <p>
              1.1. Настоящие Условия использования (далее — «Условия»)
              регулируют отношения между компанией «Нейродидактика» (далее —
              «Компания») и пользователем (далее — «Пользователь») при
              использовании платформы neuroDidactica.ru (далее — «Платформа»).
            </p>
            <p>
              1.2. Используя Платформу, Пользователь подтверждает, что
              ознакомился с настоящими Условиями и принимает их в полном объеме.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <CheckCircle className="w-5 h-5" />
              2. Регистрация и учетная запись
            </h2>
            <p>
              2.1. Для доступа к функциям Платформы Пользователь должен пройти
              регистрацию, указав достоверную информацию.
            </p>
            <p>
              2.2. Пользователь обязан сохранять конфиденциальность своих
              учетных данных и несет ответственность за все действия,
              совершенные под его учетной записью.
            </p>
            <p>
              2.3. Компания имеет право заблокировать учетную запись при
              нарушении настоящих Условий.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <Shield className="w-5 h-5" />
              3. Права и обязанности сторон
            </h2>
            <p>
              3.1. Компания предоставляет Пользователю доступ к Платформе для
              генерации образовательных экосистем с использованием технологий
              искусственного интеллекта.
            </p>
            <p>
              3.2. Пользователь имеет право использовать результаты генерации в
              образовательных целях, но не имеет права распространять их под
              видом собственных разработок.
            </p>
            <p>
              3.3. Компания не несет ответственности за точность
              сгенерированного контента и рекомендует проверять его перед
              использованием.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <AlertCircle className="w-5 h-5" />
              4. Ограничение ответственности
            </h2>
            <p>
              4.1. Платформа предоставляется «как есть» (as is) без каких-либо
              гарантий.
            </p>
            <p>
              4.2. Компания не несет ответственности за любые прямые или
              косвенные убытки, возникшие в результате использования или
              невозможности использования Платформы.
            </p>
          </div>

          <div className="terms-footer">
            <p>
              По всем вопросам:{" "}
              <a href="mailto:admin@neurodidactica.ru">
                admin@neurodidactica.ru
              </a>
            </p>
            <Link href="/auth/register" className="terms-button">
              Вернуться к регистрации
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
