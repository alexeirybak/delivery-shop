"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import SunSvg from "./SunSvg";
import MoonSvg from "./MoonSvg";
import "./styles/theme-toggle.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Переключить тему">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Переключить тему"
    >
      {theme === "light" ? <SunSvg /> : <MoonSvg />}
    </button>
  );
};
