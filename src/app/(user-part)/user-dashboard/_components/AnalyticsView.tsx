import { useState, useEffect } from "react";
import {
  TrendingUp,
  FileText,
  Users,
  Zap,
  ChevronRight,
  MessageSquare,
  Calendar,
} from "lucide-react";

import { AnalyticsViewProps } from "../types";
import { getModeLabel } from "../utils/getModeLabel";
import { getModeColor } from "../utils/getModeColor";
import { getModeIcon } from "../utils/getModeIcon";
import "../styles/analytics.css";
import { CyberLoader } from "./CyberLoader";

type ActivityDay = {
  date: string;
  count: number;
};

type AnalyticsResponse = {
  totalMaterials: number;
  totalMessages: number;
  activeDays: number;
  modeStats: Record<string, number>;
  typeStats: Record<string, number>;
  activityByDay: ActivityDay[];
};

type AnalyticsData = AnalyticsResponse & {
  averageMessagesPerChat: number;
  mostUsedMode: string;
  mostUsedType: string;
  generationTrend: number;
};

export const AnalyticsView = ({ onTabChange }: AnalyticsViewProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analytics/overview");

      if (!response.ok) {
        throw new Error("Ошибка загрузки аналитики");
      }

      const data: AnalyticsResponse = await response.json();

      const modeEntries = Object.entries(data.modeStats);
      const typeEntries = Object.entries(data.typeStats || {});

      const mostUsedMode =
        modeEntries.sort((a, b) => b[1] - a[1])[0]?.[0] || "chat_education";
      const mostUsedType =
        typeEntries.sort((a, b) => b[1] - a[1])[0]?.[0] || "education";

      const lastWeekCount = data.activityByDay.reduce(
        (sum, day) => sum + day.count,
        0,
      );

      const previousWeekCount = 0;

      const generationTrend =
        previousWeekCount === 0
          ? 100
          : ((lastWeekCount - previousWeekCount) / previousWeekCount) * 100;

      setAnalytics({
        ...data,
        mostUsedMode,
        mostUsedType,
        generationTrend,
        averageMessagesPerChat:
          data.totalMaterials > 0
            ? Math.round(data.totalMessages / data.totalMaterials)
            : 0,
      });
    } catch (error) {
      console.error("Ошибка загрузки аналитики:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading-state">
        <CyberLoader />
        <span>Загрузка аналитики...</span>
      </div>
    );
  }

  if (!analytics || analytics.totalMaterials === 0) {
    return (
      <div className="dashboard-empty-state">
        <TrendingUp className="w-16 h-16" />
        <h3>Нет данных для аналитики</h3>
        <p>
          Создайте хотя бы один материал, чтобы увидеть статистику использования
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange("generate")}
            className="create-btn"
          >
            Создать материал
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-analytics">
      <div className="analytics-header">
        <div className="analytics-title-section">
          <TrendingUp className="w-6 h-6" />
          <h2>Аналитика использования</h2>
        </div>
      </div>

      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="stat-icon">
            <FileText className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{analytics.totalMaterials}</span>
            <span className="stat-label">Всего материалов</span>
          </div>
          <div className="stat-trend positive">
            +{analytics.generationTrend}%
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{analytics.totalMessages}</span>
            <span className="stat-label">Всего сообщений</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{analytics.activeDays}</span>
            <span className="stat-label">Активных дней</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-icon">
            <Users className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {analytics.averageMessagesPerChat}
            </span>
            <span className="stat-label">Сообщений на материал</span>
          </div>
        </div>
      </div>

      <div className="analytics-chart">
        <div className="chart-header">
          <h3>Активность за неделю</h3>
          <span className="chart-subtitle">
            Количество созданных материалов по дням
          </span>
        </div>

        <div className="chart-container">
          <div className="chart-y-axis">
            {(() => {
              const maxCount = Math.max(
                ...analytics.activityByDay.map((d) => d.count),
                1,
              );

              const steps = Math.min(5, maxCount);

              const stepValue = maxCount / steps;

              return Array.from({ length: steps + 1 }, (_, i) => {
                const value = Math.round(maxCount - stepValue * i);

                return (
                  <div key={i} className="y-axis-label">
                    {value}
                  </div>
                );
              });
            })()}
          </div>

          <div className="chart-area">
            <div className="chart-grid-lines">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid-line" />
              ))}
            </div>

            <div className="chart-bars">
              {(() => {
                const maxCount = Math.max(
                  ...analytics.activityByDay.map((d) => d.count),
                  1,
                );

                return analytics.activityByDay.map((day, index) => {
                  const height = (day.count / maxCount) * 100;

                  return (
                    <div key={index} className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                      >
                        {day.count > 0 && (
                          <span className="bar-value">{day.count}</span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="chart-labels">
              {analytics.activityByDay.map((day, index) => {
                const date = new Date(day.date);
                const dayLabel = date.toLocaleDateString("ru-RU", {
                  weekday: "short",
                });

                return (
                  <div key={index} className="chart-label">
                    {dayLabel}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-modes">
        <h3>Популярные режимы генерации</h3>

        <div className="modes-grid">
          {Object.entries(analytics.modeStats)
            .sort((a, b) => b[1] - a[1])
            .map(([mode, count]) => {
              const percentage = (count / analytics.totalMaterials) * 100;

              const Icon = getModeIcon(mode);
              const color = getModeColor(mode);

              return (
                <div key={mode} className="mode-stat">
                  <div className="mode-header">
                    <div className="mode-title">
                      {Icon && <Icon className="w-4 h-4" style={{ color }} />}
                      <span className="mode-name" style={{ color }}>
                        {getModeLabel(mode)}
                      </span>
                    </div>
                    <span className="mode-count">{count}</span>
                  </div>

                  <div className="mode-progress">
                    <div
                      className="mode-progress-bar"
                      style={{
                        width: `${percentage}%`,
                        background: color,
                      }}
                    />
                  </div>

                  <span className="mode-percentage">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="analytics-types">
        <h3>Типы материалов</h3>

        <div className="types-grid">
          {Object.entries(analytics.typeStats)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => {
              const percentage = (count / analytics.totalMaterials) * 100;

              const typeLabels: Record<string, string> = {
                education: "Обучение",
                learning: "Изучение",
                "scientific-articles": "Научные статьи",
                visualizations: "Визуализации",
                textbooks: "Учебники",
                audio: "Аудио",
              };

              return (
                <div key={type} className="type-stat">
                  <div className="type-header">
                    <span className="type-name">
                      {typeLabels[type] || type}
                    </span>
                    <span className="type-count">{count}</span>
                  </div>

                  <div className="type-progress">
                    <div
                      className="type-progress-bar"
                      style={{
                        width: `${percentage}%`,
                        background:
                          "linear-gradient(135deg, var(--color-cyan), var(--color-blue))",
                      }}
                    />
                  </div>

                  <span className="type-percentage">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="analytics-actions">
        <button
          className="analytics-action-btn"
          onClick={() => onTabChange?.("generate")}
        >
          <Zap className="w-4 h-4" />
          <span>Создать материал</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
