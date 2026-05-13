"use client";

import Link from "next/link";
import { Home, CheckCircle } from "lucide-react";
import "./styles/goodbye-page.css";

const GoodbyePage = () => {
  return (
    <div className="goodbye-container">
      <div className="goodbye-icon-wrapper">
        <CheckCircle className="goodbye-icon" />
      </div>
      
      <h1 className="goodbye-title">Аккаунт успешно удален</h1>
      
      <p className="goodbye-description">
        Ваш аккаунт был успешно удален. Все ваши данные безвозвратно удалены из системы.
        Мы будем рады видеть вас снова!
      </p>
      
      <Link href="/" className="goodbye-btn">
        <Home className="goodbye-btn-icon" />
        На главную
      </Link>
    </div>
  );
};

export default GoodbyePage;