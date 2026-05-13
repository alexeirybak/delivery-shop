"use client";

import LogoBlock from "../logo/LogoBlock";
import NavBar from "./NavBar";
import { useScrollEffects } from "@/app/home/hooks/useScrollEffects";
import { ThemeToggle } from "./ThemeToggle";
import "./styles/header.css";

export const Header = () => {
  const { isScrolled } = useScrollEffects();

  return (
    <header
      className={`header reveal reveal-1 ${isScrolled ? "backdrop-blur-md" : ""}`}
    >
      <LogoBlock />
      <div className="header-nav-theme-block">
        <NavBar />
        <ThemeToggle />
      </div>
    </header>
  );
};
