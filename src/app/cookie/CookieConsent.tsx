"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import "./styles/cookie-consent.css";

const getCookieConsent = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cookieConsent");
};

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getCookieConsent, () => null);
  const showConsent = consent === null;

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    window.dispatchEvent(new Event("storage"));
  };

  if (!showConsent) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-container">
        <p className="cookie-consent-text">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая
          пользоваться сайтом, Вы соглашаетесь с{" "}
          <Link href="/policy" className="cookie-consent-link">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button onClick={acceptCookies} className="cookie-consent-button">
          Принять
        </button>
      </div>
    </div>
  );
}