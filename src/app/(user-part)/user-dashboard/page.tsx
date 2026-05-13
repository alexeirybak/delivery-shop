"use client";

import { useState } from "react";
import { modeConfig } from "@/utils/modeConfig";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardTabs } from "./_components/DashboardTabs";
import { ContentTypeCard } from "./_components/ContentTypeCard";
import { LibraryView } from "./_components/LibraryView";
import { AnalyticsView } from "./_components/AnalyticsView";
import {
  GraduationCap,
  FileText,
  Users,
  Lightbulb,
  Microscope,
  GitBranch,
  PenTool,
  Mic,
  NotebookPen,
} from "lucide-react";
import "./styles/user-dashboard.css";

const STORAGE_KEY = "dashboard_active_tab";

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem(STORAGE_KEY);
      if (savedTab && ["generate", "library", "analytics"].includes(savedTab)) {
        return savedTab;
      }
    }
    return "generate";
  });

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem(STORAGE_KEY, tab);
  };

  const handleGenerate = (typeId: string) => {
    setSelectedType(typeId);
  };

  const allCards = Object.values(modeConfig);

  const workbookCard = allCards.find((type) => type.id === "workbook");
  const educationCards = allCards.filter((type) => type.type === "education");
  const scienceCards = allCards.filter((type) => type.type === "science");
  const learningCards = allCards.filter((type) => type.type === "learning");
  const writingCards = allCards.filter((type) => type.type === "writing");
  const visualizationCards = allCards.filter(
    (type) => type.type === "visualization",
  );
  const audioCards = allCards.filter((type) => type.type === "audio");

  return (
    <div className="dashboard-container">
      <div className="dashboard-glow" />

      <DashboardHeader />

      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="dashboard-main">
        {activeTab === "generate" && (
          <>
            {/* ========== РАБОЧАЯ ТЕТРАДЬ (САМЫЙ ВЕРХ) ========== */}
            {workbookCard && (
              <>
                <div className="content-section featured-section">
                  <div className="section-header">
                    <div className="section-title-wrapper">
                      <NotebookPen className="section-icon" size={24} />
                      <h2 className="section-title">Рабочая тетрадь</h2>
                    </div>
                    <p className="section-description">
                      Создание и управление записями в личных рабочих тетрадях
                    </p>
                  </div>
                  <div className="dashboard-grid">
                    <ContentTypeCard
                      key={workbookCard.id}
                      id={workbookCard.id}
                      title={workbookCard.label}
                      description={workbookCard.description}
                      color={workbookCard.color}
                      gradient={workbookCard.gradient}
                      icon={workbookCard.icon}
                      link={workbookCard.link}
                      mode={workbookCard.id}
                      isSelected={selectedType === workbookCard.id}
                      onSelect={handleGenerate}
                    />
                  </div>
                </div>

                <div className="section-divider">
                  <div className="divider-line"></div>
                  <div className="divider-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="divider-line"></div>
                </div>
              </>
            )}

            {/* ========== ОБРАЗОВАТЕЛЬНЫЕ МАТЕРИАЛЫ ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <GraduationCap className="section-icon" size={24} />
                  <h2 className="section-title">Образовательные материалы</h2>
                </div>
                <p className="section-description">
                  Лекции, тесты, презентации, структуры курсов и многое другое
                </p>
              </div>
              <div className="dashboard-grid">
                {educationCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>

            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">
                <Microscope size={20} />
              </div>
              <div className="divider-line"></div>
            </div>

            {/* ========== НАУЧНЫЕ ПУБЛИКАЦИИ ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <FileText className="section-icon" size={24} />
                  <h2 className="section-title">Научные публикации</h2>
                </div>
                <p className="section-description">
                  Исследовательские статьи, обзоры, методология и кейсы
                </p>
              </div>
              <div className="dashboard-grid">
                {scienceCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>

            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">
                <Lightbulb size={20} />
              </div>
              <div className="divider-line"></div>
            </div>

            {/* ========== ДЛЯ САМООБУЧЕНИЯ ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <Users className="section-icon" size={24} />
                  <h2 className="section-title">Для самообучения</h2>
                </div>
                <p className="section-description">
                  Психологическая поддержка, решебник, шпаргалки
                </p>
              </div>
              <div className="dashboard-grid">
                {learningCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>

            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">
                <PenTool size={20} />
              </div>
              <div className="divider-line"></div>
            </div>

            {/* ========== ПИСЬМЕННЫЕ РАБОТЫ ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <PenTool className="section-icon" size={24} />
                  <h2 className="section-title">Письменные работы</h2>
                </div>
                <p className="section-description">
                  Эссе, контрольные, курсовые, рефераты и выпускные
                  квалификационные работы
                </p>
              </div>
              <div className="dashboard-grid">
                {writingCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>

            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">
                <GitBranch size={20} />
              </div>
              <div className="divider-line"></div>
            </div>

            {/* ========== ГРАФИКА ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <GitBranch className="section-icon" size={24} />
                  <h2 className="section-title">Графика</h2>
                </div>
                <p className="section-description">
                  Ментальные карты, блок-схемы, диаграммы и визуализации данных
                </p>
              </div>
              <div className="dashboard-grid">
                {visualizationCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>

            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-icon">
                <Mic size={20} />
              </div>
              <div className="divider-line"></div>
            </div>

            {/* ========== РАБОТА СО ЗВУКОМ ========== */}
            <div className="content-section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <Mic className="section-icon" size={24} />
                  <h2 className="section-title">Работа со звуком</h2>
                </div>
                <p className="section-description">
                  Диктовка, транскрибация аудио и преобразование текста в речь
                </p>
              </div>
              <div className="dashboard-grid">
                {audioCards.map((type) => (
                  <ContentTypeCard
                    key={type.id}
                    id={type.id}
                    title={type.label}
                    description={type.description}
                    color={type.color}
                    gradient={type.gradient}
                    icon={type.icon}
                    link={type.link}
                    mode={type.id}
                    isSelected={selectedType === type.id}
                    onSelect={handleGenerate}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "library" && (
          <LibraryView onTabChange={handleTabChange} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
