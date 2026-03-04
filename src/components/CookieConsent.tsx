"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm md:text-base">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая
          пользоваться сайтом, Вы соглашаетесь с{" "}
          <Link href="/policy" className="text-blue-400 underline">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={acceptCookies}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm whitespace-nowrap cursor-pointer"
        >
          Принять
        </button>
      </div>
    </div>
  );
}