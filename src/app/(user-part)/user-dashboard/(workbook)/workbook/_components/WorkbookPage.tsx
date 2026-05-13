"use client";

import { Header } from "../../records/_components/Header";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DashboardCardsGrid } from "./DashboardCardsGrid";
import { StatsSection } from "./StatsSection";
import "../../../styles/generate-page.css";
import '../../styles/workbook-page.css'

const WorkbookPage = () => {
  return (
    <div className="generate-page">
      <div className="workbook-page">
        <Link href="/user-dashboard" className="generate-section-link">
          <ChevronLeft className="w-4 h-4" />К панели управления
        </Link>
        <Header
          title="Рабочие тетради"
          description="Создание, просмотр и управление записями"
        />
        <DashboardCardsGrid />
        <StatsSection />
      </div>
    </div>
  );
};

export default WorkbookPage;
