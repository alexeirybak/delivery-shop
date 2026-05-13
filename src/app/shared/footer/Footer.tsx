import Link from "next/link";
import { Copyright } from "lucide-react";
import LogoBlock from "../logo/LogoBlock";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-section" data-scroll>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <LogoBlock />
          </div>
          <p>
            Платформа для генерации образовательного и научного контента, где AI генерирует текст, изображения, строит диаграммы и графики как полноценный цифровой продукт.
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <span>Продукт</span>
            <Link href="/user-dashboard">Генерация курсов</Link>
            <Link href="/pricing">Тарифы</Link>
          </div>

          <div className="footer-column">
            <span>Компания</span>
            <Link href="/about">О платформе</Link>
            <Link href="/contacts">Контакты</Link>
          </div>

          <div className="footer-column">
            <span>Безопасность</span>
            <Link href="/policy">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <span className="copyright">
          <Copyright className="copyright-icon" />
          {new Date().getFullYear()} NeuroDidactica
        </span>
      </div>
    </footer>
  );
};

export default Footer;