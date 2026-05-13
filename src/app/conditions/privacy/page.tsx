import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, Database, Trash2, Mail } from "lucide-react";
import LogoSvg from "@/app/shared/logo/LogoSvg";
import "../../conditions/conditions.css";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | NeuroDidactica",
  description: "Как мы собираем, используем и защищаем Ваши данные",
};

export default function PrivacyPage() {
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
          <h1 className="terms-title">Политика конфиденциальности</h1>
          <p className="terms-date">Последнее обновление: 01 мая 2026 г.</p>

          <div className="terms-section">
            <h2>
              <Database className="w-5 h-5" />
              1. Какие данные мы собираем
            </h2>
            <p>1.1. При регистрации мы собираем следующую информацию:</p>
            <ul>
              <li>Имя и фамилия</li>
              <li>Адрес электронной почты</li>
              <li>Статус (преподаватель, методист, студент и т.д.)</li>
              <li>Страна проживания (опционально)</li>
              <li>Организация/учебное заведение (опционально)</li>
            </ul>
            <p>
              1.2. При использовании Платформы мы автоматически собираем
              техническую информацию: IP-адрес, тип браузера, действия на
              платформе.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <Lock className="w-5 h-5" />
              2. Как мы используем Ваши данные
            </h2>
            <p>2.1. Ваши данные используются для:</p>
            <ul>
              <li>Предоставления доступа к Платформе и ее функциям</li>
              <li>Персонализации образовательного контента</li>
              <li>Улучшения работы алгоритмов искусственного интеллекта</li>
              <li>Отправки уведомлений о новых функциях (с Вашего согласия)</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>
              <Eye className="w-5 h-5" />
              3. Защита данных
            </h2>
            <p>
              3.1. Мы используем современные методы шифрования для защиты Ваших
              данных.
            </p>
            <p>
              3.2. Доступ к данным имеют только сотрудники, которым это
              необходимо для выполнения своих обязанностей.
            </p>
            <p>
              3.3. Мы не передаем Ваши персональные данные третьим лицам, за
              исключением случаев, предусмотренных законодательством РФ.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <Trash2 className="w-5 h-5" />
              4. Хранение и удаление данных
            </h2>
            <p>
              4.1. Ваши данные хранятся на серверах, расположенных на территории
              РФ.
            </p>
            <p>
              4.2. Вы можете в любой момент запросить удаление своей учетной
              записи и всех связанных с ней данных, написав на{" "}
              <a href="mailto:admin@neurodidactica.ru">
                admin@neurodidactica.ru
              </a>
              .
            </p>
            <p>
              4.3. После удаления учетной записи Ваши данные будут безвозвратно
              удалены в течение 30 дней.
            </p>
          </div>

          <div className="terms-section">
            <h2>
              <Mail className="w-5 h-5" />
              5. Контактная информация
            </h2>
            <p>
              По всем вопросам, связанным с обработкой персональных данных, вы
              можете обращаться:
            </p>
            <ul className="contact-list">
              <li>
                Email:{" "}
                <a href="mailto:privacy@neurodidactica.ru">
                  admin@neurodidactica.ru
                </a>
              </li>
              <li>Телефон: +7 (495) 123-45-67</li>
              <li>Адрес: 164500, г. Северодвинск, офис 100</li>
            </ul>
          </div>

          <div className="terms-footer">
            <Link href="/auth/register" className="terms-button">
              Вернуться к регистрации
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
