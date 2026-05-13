"use client";

import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ResetSettingsButton } from "./ResetSettingsButton";
import { SettingsButton } from "./SettingsButton";
import "../styles/settings-panel.css";


interface SettingsPanelLayoutProps {
  title: string;
  buttonLabel: string;
  children: ReactNode;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onReset: () => void;
  resetLabel?: string;
}

export const SettingsPanelLayout = ({
  title,
  buttonLabel,
  children,
  showSettings,
  setShowSettings,
  onReset,
}: SettingsPanelLayoutProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  const handleClose = () => {
    setShowSettings(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [showSettings, setShowSettings]);

  const settingsPanel = (
    <>
      {showSettings && (
        <div className="settings-panel-overlay" onClick={handleClose} />
      )}
      <div
        ref={panelRef}
        className={`settings-panel-sidebar ${showSettings ? "open" : ""}`}
      >
        <div className="settings-panel-sidebar-header">
          <h3>{title}</h3>
          <button
            className="close-settings-btn"
            onClick={handleClose}
            aria-label="Закрыть настройки"
          >
            <X size={20} />
          </button>
        </div>

        <div className="settings-panel-sidebar-content">
          {children}
        </div>

        <ResetSettingsButton onReset={onReset} />
      </div>
    </>
  );

  return (
    <>
      <SettingsButton onClick={handleToggle} label={buttonLabel} />
      {createPortal(settingsPanel, document.body)}
    </>
  );
};