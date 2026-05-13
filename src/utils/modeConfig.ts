import {
  BookOpen,
  CalendarCheck,
  FileText,
  GraduationCap,
  Library,
  MessageSquare,
  Sparkles,
  TestTube,
  Presentation,
  Microscope,
  Briefcase,
  Search,
  Settings,
  Brain,
  GitBranch,
  Layers,
  FlaskConical,
  FolderKanban,
  ScrollText,
  Scale,
  Sword,
  Clock,
  BookMarked,
  NotebookPen,
  PenTool,
  Beaker,
  FileCheck,
  Network,
  Workflow,
  BarChart,
  PieChart,
  LineChart,
  Table,
  GitMerge,
  Radar,
  Compass,
  Heart,
  Mic,
  FileAudio,
  Users,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type ModeType =
  | "workbook"
  | "education"
  | "science"
  | "learning"
  | "writing"
  | "visualization"
  | "audio";

export type ModeConfig = {
  id: string;
  type: ModeType;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  link: string;
};

export const modeConfig: Record<string, ModeConfig> = {
  // ========== РАБОЧАЯ ТЕТРАДЬ (type: workbook) ==========

  workbook: {
    id: "workbook",
    type: "workbook",
    label: "Рабочая тетрадь",
    description: "Текстовый редактор с ИИ",
    icon: NotebookPen,
    color: "#14b8a6",
    gradient:
      "radial-gradient(circle at 70% 20%, rgba(20,184,166,0.14), rgba(45,212,191,0.08), rgba(13,148,136,0.04))",
    link: "/user-dashboard/workbook",
  },
  // ========== ОБРАЗОВАТЕЛЬНЫЕ МАТЕРИАЛЫ (type: education) ==========

  chat_education: {
    id: "chat_education",
    type: "education",
    label: "Образовательный чат",
    description: "Обычный диалог, ответы на вопросы",
    icon: MessageSquare,
    color: "#60c50a",
    gradient:
      "linear-gradient(135deg, rgba(96,197,10,0.15), rgba(76,175,80,0.08), rgba(56,142,60,0.04))",
    link: "/user-dashboard/education",
  },
  syllabus: {
    id: "syllabus",
    type: "education",
    label: "Структура курса",
    description: "Темы, цели, литература",
    icon: BookMarked,
    color: "#8b5cf6",
    gradient:
      "linear-gradient(120deg, rgba(139,92,246,0.2), rgba(99,102,241,0.12), rgba(79,70,229,0.06))",
    link: "/user-dashboard/education",
  },
  annotation: {
    id: "annotation",
    type: "education",
    label: "Аннотация",
    description: "Получите краткое содержание книги, статьи или документа",
    icon: ScrollText,
    color: "#14b8a6",
    gradient:
      "linear-gradient(130deg, rgba(20,184,166,0.13), rgba(45,212,191,0.08), rgba(13,148,136,0.04))",
    link: "/user-dashboard/education",
  },
  homework_check: {
    id: "homework_check",
    type: "education",
    label: "Проверка ДЗ",
    description:
      "Проверка письменных домашних заданий с распознаванием почерка",
    icon: FileCheck,
    color: "#f97316",
    gradient:
      "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(250,204,21,0.1), rgba(234,179,8,0.06))",
    link: "/user-dashboard/education",
  },
  lecture: {
    id: "lecture",
    type: "education",
    label: "Лекция",
    description: "Подробная академическая лекция",
    icon: BookOpen,
    color: "#ff4401",
    gradient:
      "linear-gradient(135deg, rgba(16,109,100,0.16), rgba(152,1,14,0.1), rgba(5,150,105,0.06))",

    link: "/user-dashboard/education",
  },
  practice: {
    id: "practice",
    type: "education",
    label: "Практические занятия",
    description: "Семинары, кейсы, задания",
    icon: CalendarCheck,
    color: "#10b981",
    gradient:
      "linear-gradient(115deg, rgba(16,185,129,0.16), rgba(52,211,153,0.1), rgba(5,150,105,0.06))",
    link: "/user-dashboard/education",
  },
  laboratory: {
    id: "laboratory",
    type: "education",
    label: "Лабораторная работа",
    description: "Пошаговые инструкции для экспериментов",
    icon: FlaskConical,
    color: "#06b6d4",
    gradient:
      "linear-gradient(105deg, rgba(6,182,212,0.17), rgba(14,165,233,0.12), rgba(2,132,199,0.06))",
    link: "/user-dashboard/education",
  },
  interactive: {
    id: "interactive",
    type: "education",
    label: "Интерактивный урок",
    description: "Диалоговое обучение с вопросами и проверкой понимания",
    icon: Brain,
    color: "#d946ef",
    gradient:
      "linear-gradient(125deg, rgba(217,70,239,0.18), rgba(168,85,247,0.12), rgba(96,165,250,0.06))",
    link: "/user-dashboard/education",
  },
  debate: {
    id: "debate",
    type: "education",
    label: "Дебаты",
    description: "Аргументы за и против по дискуссионным темам",
    icon: Sword,
    color: "#ec489a",
    gradient:
      "radial-gradient(circle at 50% 50%, rgba(236,72,154,0.14), rgba(219,39,119,0.09), rgba(168,85,247,0.05))",
    link: "/user-dashboard/education",
  },
  project: {
    id: "project",
    type: "education",
    label: "Проектная работа",
    description: "Планирование и структура проекта",
    icon: FolderKanban,
    color: "#ef4444",
    gradient:
      "repeating-linear-gradient(45deg, rgba(239,68,68,0.12), rgba(251,146,60,0.08), rgba(249,115,22,0.06), rgba(239,68,68,0.1))",
    link: "/user-dashboard/education",
  },
  comparison: {
    id: "comparison",
    type: "education",
    label: "Сравнительный анализ",
    description: "Сопоставление теорий, концепций, авторов",
    icon: Scale,
    color: "#f59e0b",
    gradient:
      "linear-gradient(145deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1), rgba(234,88,12,0.05))",
    link: "/user-dashboard/education",
  },
  presentation: {
    id: "presentation",
    type: "education",
    label: "Презентация",
    description: "Генерация слайдов для выступлений",
    icon: Presentation,
    color: "#a855f7",
    gradient:
      "linear-gradient(150deg, rgba(168,85,247,0.17), rgba(139,92,246,0.12), rgba(96,165,250,0.07))",
    link: "/user-dashboard/education",
  },
  quiz: {
    id: "quiz",
    type: "education",
    label: "Тест",
    description: "Создание тестов с различными уровнями сложности",
    icon: TestTube,
    color: "#ec489a",
    gradient:
      "linear-gradient(140deg, rgba(236,72,154,0.18), rgba(219,39,119,0.12), rgba(244,114,182,0.06))",
    link: "/user-dashboard/education",
  },
  credit: {
    id: "credit",
    type: "education",
    label: "Зачет",
    description: "Вопросы для сдачи зачета по дисциплине",
    icon: FileCheck,
    color: "#10b981",
    gradient:
      "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.1), rgba(5,150,105,0.06))",
    link: "/user-dashboard/education",
  },
  exams: {
    id: "exams",
    type: "education",
    label: "Экзамен",
    description: "Вопросы и оценочные материалы",
    icon: GraduationCap,
    color: "#8b5cf6",
    gradient:
      "conic-gradient(from 0deg at 50% 50%, rgba(139,92,246,0.12), rgba(99,102,241,0.08), rgba(6,182,212,0.06), rgba(139,92,246,0.1))",
    link: "/user-dashboard/education",
  },

  // ========== НАУЧНЫЕ СТАТЬИ (type: science) ==========

  chat_science: {
    id: "chat_science",
    type: "science",
    label: "Научный чат",
    description:
      "Консультации по научным исследованиям, обсуждение методологии",
    icon: MessageSquare,
    color: "#60c50a",
    gradient:
      "linear-gradient(135deg, rgba(96,197,10,0.15), rgba(76,175,80,0.08), rgba(56,142,60,0.04))",
    link: "/user-dashboard/science",
  },
  conference: {
    id: "conference",
    type: "science",
    label: "Тезисы конференции",
    description: "Краткое изложение для конференций",
    icon: Presentation,
    color: "#8b5cf6",
    gradient:
      "repeating-radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), rgba(99,102,241,0.08), rgba(79,70,229,0.05))",
    link: "/user-dashboard/science",
  },
  review: {
    id: "review",
    type: "science",
    label: "Обзорная статья",
    description: "Анализ и систематизация научных исследований",
    icon: FileText,
    color: "#14b8a6",
    gradient:
      "radial-gradient(ellipse at 40% 60%, rgba(20,184,166,0.14), rgba(13,148,136,0.09), rgba(5,150,105,0.05))",
    link: "/user-dashboard/science",
  },
  research: {
    id: "research",
    type: "science",
    label: "Исследовательская статья",
    description: "Оригинальное научное исследование",
    icon: Microscope,
    color: "#f59e0b",
    gradient:
      "linear-gradient(125deg, rgba(245,158,11,0.16), rgba(249,115,22,0.12), rgba(234,88,12,0.07))",
    link: "/user-dashboard/science",
  },
  experimental: {
    id: "experimental",
    type: "science",
    label: "Экспериментальная статья",
    description: "Дизайн эксперимента, результаты, выводы",
    icon: Beaker,
    color: "#ec489a",
    gradient:
      "conic-gradient(from 45deg at 50% 50%, rgba(236,72,154,0.12), rgba(219,39,119,0.08), rgba(244,114,182,0.06), rgba(236,72,154,0.1))",
    link: "/user-dashboard/science",
  },
  methodology: {
    id: "methodology",
    type: "science",
    label: "Методология",
    description: "Оценка применяемых и разработка новых методов исследования",
    icon: Settings,
    color: "#0ea5e9",
    gradient:
      "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.1), rgba(56,189,248,0.06))",
    link: "/user-dashboard/science",
  },
  case: {
    id: "case",
    type: "science",
    label: "Кейс-стади",
    description: "Анализ практических ситуаций",
    icon: Briefcase,
    color: "#ef4444",
    gradient:
      "repeating-linear-gradient(135deg, rgba(239,68,68,0.12), rgba(251,146,60,0.08), rgba(239,68,68,0.1))",
    link: "/user-dashboard/science",
  },
  literature: {
    id: "literature",
    type: "science",
    label: "Литературный обзор",
    description: "Обзор существующих исследований по теме",
    icon: Library,
    color: "#06b6d4",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(6,182,212,0.14), rgba(59,130,246,0.09), rgba(37,99,235,0.05))",
    link: "/user-dashboard/science",
  },
  systematic: {
    id: "systematic",
    type: "science",
    label: "Систематический обзор",
    description: "Строгий анализ научной литературы",
    icon: Search,
    color: "#6366f1",
    gradient:
      "conic-gradient(from 270deg at 50% 50%, rgba(99,102,241,0.12), rgba(139,92,246,0.08), rgba(168,85,247,0.06), rgba(99,102,241,0.1))",
    link: "/user-dashboard/science",
  },
  hypothesis: {
    id: "hypothesis",
    type: "science",
    label: "Гипотеза",
    description: "Формулировка и обоснование гипотез",
    icon: Sparkles,
    color: "#a855f7",
    gradient:
      "linear-gradient(105deg, rgba(168,85,247,0.16), rgba(236,72,154,0.12), rgba(244,114,182,0.07))",
    link: "/user-dashboard/science",
  },

  // ========== ДЛЯ САМОСТОЯТЕЛЬНОГО ОБУЧЕНИЯ (type: learning) ==========

  chat_learning: {
    id: "chat_learning",
    type: "learning",
    label: "Чат для учащихся",
    description: "Ответы на вопросы, объяснение сложных тем",
    icon: MessageSquare,
    color: "#60c50a",
    gradient:
      "linear-gradient(135deg, rgba(96,197,10,0.15), rgba(76,175,80,0.08), rgba(56,142,60,0.04))",
    link: "/user-dashboard/learning",
  },
  psychological_support: {
    id: "psychological_support",
    type: "learning",
    label: "Психологическая поддержка",
    description:
      "Анонимный голосовой чат для снятия стресса, тревоги и учебной нагрузки",
    icon: Heart,
    color: "#ec489a",
    gradient:
      "linear-gradient(135deg, rgba(236,72,154,0.2), rgba(244,114,182,0.12), rgba(219,39,119,0.06))",
    link: "/user-dashboard/learning",
  },
  solution_book: {
    id: "solution_book",
    type: "learning",
    label: "Решебник",
    description: "Пошаговые решения задач и упражнений",
    icon: PenTool,
    color: "#8b5cf6",
    gradient:
      "linear-gradient(120deg, rgba(139,92,246,0.2), rgba(99,102,241,0.12), rgba(79,70,229,0.06))",
    link: "/user-dashboard/learning",
  },
  cheatsheets: {
    id: "cheatsheets",
    type: "learning",
    label: "Шпаргалки",
    description: "Краткие конспекты и формулы",
    icon: Sparkles,
    color: "#f59e0b",
    gradient:
      "linear-gradient(125deg, rgba(245,158,11,0.16), rgba(249,115,22,0.12), rgba(234,88,12,0.07))",
    link: "/user-dashboard/learning",
  },

  // ========== ПИСЬМЕННЫЕ РАБОТЫ (type: writing) ==========
  essay: {
    id: "essay",
    type: "writing",
    label: "Эссе",
    description: "Написание эссе на заданную тему с аргументацией и выводами",
    icon: PenTool,
    color: "#f59e0b",
    gradient:
      "linear-gradient(145deg, rgba(245,158,11,0.18), rgba(249,115,22,0.1), rgba(234,88,12,0.05))",
    link: "/user-dashboard/writing",
  },
  test: {
    id: "test",
    type: "writing",
    label: "Контрольная работа",
    description: "Генерация контрольных работ с вопросами и заданиями",
    icon: FileCheck,
    color: "#ef4444",
    gradient:
      "repeating-linear-gradient(45deg, rgba(239,68,68,0.12), rgba(251,146,60,0.08), rgba(249,115,22,0.06), rgba(239,68,68,0.1))",
    link: "/user-dashboard/writing",
  },
  coursework: {
    id: "coursework",
    type: "writing",
    label: "Курсовая работа",
    description: "Структурирование и написание курсовых работ",
    icon: BookOpen,
    color: "#8b5cf6",
    gradient:
      "linear-gradient(120deg, rgba(139,92,246,0.2), rgba(99,102,241,0.12), rgba(79,70,229,0.06))",
    link: "/user-dashboard/writing",
  },
  report: {
    id: "report",
    type: "writing",
    label: "Реферат",
    description: "Создание рефератов по различным темам",
    icon: ScrollText,
    color: "#10b981",
    gradient:
      "linear-gradient(115deg, rgba(16,185,129,0.16), rgba(52,211,153,0.1), rgba(5,150,105,0.06))",
    link: "/user-dashboard/writing",
  },
  thesis: {
    id: "thesis",
    type: "writing",
    label: "ВКР",
    description:
      "Выпускная квалификационная работа: структура, содержание, оформление",
    icon: GraduationCap,
    color: "#ec489a",
    gradient:
      "linear-gradient(140deg, rgba(236,72,154,0.18), rgba(219,39,119,0.12), rgba(244,114,182,0.06))",
    link: "/user-dashboard/writing",
  },
  textbooks: {
    id: "textbook",
    type: "writing",
    label: "Учебники",
    description: "Полноценные учебники по различным темам и дисциплинам",
    icon: BookOpen,
    color: "#3b82f6",
    gradient:
      "linear-gradient(160deg, rgba(59,130,246,0.14), rgba(37,99,235,0.1), rgba(29,78,216,0.06))",
    link: "/user-dashboard/writing",
  },

  // ========== ВИЗУАЛИЗАЦИИ (type: visualization) ==========

  mindmap: {
    id: "mindmap",
    type: "visualization",
    label: "Ментальная карта",
    description: "Визуализация связей между понятиями и идеями",
    icon: GitBranch,
    color: "#a855f7",
    gradient:
      "conic-gradient(from 90deg at 50% 50%, rgba(168,85,247,0.12), rgba(139,92,246,0.08), rgba(236,72,154,0.06), rgba(168,85,247,0.1))",
    link: "/user-dashboard/visualizations",
  },
  flowchart: {
    id: "flowchart",
    type: "visualization",
    label: "Блок-схема",
    description: "Визуализация алгоритмов и процессов",
    icon: Workflow,
    color: "#10b981",
    gradient:
      "linear-gradient(115deg, rgba(16,185,129,0.16), rgba(52,211,153,0.1), rgba(5,150,105,0.06))",
    link: "/user-dashboard/visualizations",
  },
  network: {
    id: "network",
    type: "visualization",
    label: "Сетевой граф",
    description: "Визуализация связей между узлами",
    icon: Network,
    color: "#ec489a",
    gradient:
      "linear-gradient(140deg, rgba(236,72,154,0.18), rgba(219,39,119,0.12), rgba(244,114,182,0.06))",
    link: "/user-dashboard/visualizations",
  },
  barchart: {
    id: "barchart",
    type: "visualization",
    label: "Столбчатая диаграмма",
    description: "Сравнение значений по категориям",
    icon: BarChart,
    color: "#f59e0b",
    gradient:
      "linear-gradient(145deg, rgba(245,158,11,0.18), rgba(249,115,22,0.1), rgba(234,88,12,0.05))",
    link: "/user-dashboard/visualizations",
  },
  piechart: {
    id: "piechart",
    type: "visualization",
    label: "Круговая диаграмма",
    description: "Пропорции и доли целого",
    icon: PieChart,
    color: "#ef4444",
    gradient:
      "repeating-linear-gradient(45deg, rgba(239,68,68,0.12), rgba(251,146,60,0.08), rgba(249,115,22,0.06), rgba(239,68,68,0.1))",
    link: "/user-dashboard/visualizations",
  },
  linechart: {
    id: "linechart",
    type: "visualization",
    label: "Линейный график",
    description: "Тренды и изменения во времени",
    icon: LineChart,
    color: "#3b82f6",
    gradient:
      "linear-gradient(160deg, rgba(59,130,246,0.14), rgba(37,99,235,0.1), rgba(29,78,216,0.06))",
    link: "/user-dashboard/visualizations",
  },
  radarchart: {
    id: "radarchart",
    type: "visualization",
    label: "Лепестковая диаграмма",
    description: "Сравнение многомерных данных",
    icon: Radar,
    color: "#8b5cf6",
    gradient:
      "linear-gradient(120deg, rgba(139,92,246,0.2), rgba(99,102,241,0.12), rgba(79,70,229,0.06))",
    link: "/user-dashboard/visualizations",
  },
  visualization_comparison: {
    id: "visualization_comparison",
    type: "visualization",
    label: "Сравнительная таблица",
    description: "Сопоставление характеристик объектов",
    icon: Table,
    color: "#14b8a6",
    gradient:
      "linear-gradient(130deg, rgba(20,184,166,0.13), rgba(45,212,191,0.08), rgba(13,148,136,0.04))",
    link: "/user-dashboard/visualizations",
  },
  roadmap: {
    id: "roadmap",
    type: "visualization",
    label: "Дорожная карта",
    description: "План развития и вехи проекта",
    icon: Compass,
    color: "#d946ef",
    gradient:
      "linear-gradient(125deg, rgba(217,70,239,0.18), rgba(168,85,247,0.12), rgba(96,165,250,0.06))",
    link: "/user-dashboard/visualizations",
  },
  hierarchy: {
    id: "hierarchy",
    type: "visualization",
    label: "Иерархическая схема",
    description: "Организационные структуры и таксономии",
    icon: GitMerge,
    color: "#06b6d4",
    gradient:
      "linear-gradient(105deg, rgba(6,182,212,0.17), rgba(14,165,233,0.12), rgba(2,132,199,0.06))",
    link: "/user-dashboard/visualizations",
  },
  timeline: {
    id: "timeline",
    type: "visualization",
    label: "Хронология",
    description: "Временная шкала событий или этапов",
    icon: Clock,
    color: "#ec489a",
    gradient:
      "linear-gradient(140deg, rgba(236,72,154,0.18), rgba(219,39,119,0.12), rgba(244,114,182,0.06))",
    link: "/user-dashboard/visualizations",
  },
  flashcards: {
    id: "flashcards",
    type: "visualization",
    label: "Карточки",
    description: "Набор карточек для запоминания",
    icon: Layers,
    color: "#f97316",
    gradient:
      "linear-gradient(115deg, rgba(249,115,22,0.16), rgba(250,204,21,0.1), rgba(234,179,8,0.05))",
    link: "/user-dashboard/visualizations",
  },
  glossary: {
    id: "glossary",
    type: "visualization",
    label: "Глоссарий",
    description: "Словарь терминов и определений",
    icon: BookMarked,
    color: "#6366f1",
    gradient:
      "linear-gradient(155deg, rgba(99,102,241,0.14), rgba(139,92,246,0.1), rgba(168,85,247,0.05))",
    link: "/user-dashboard/visualizations",
  },
  roleplay: {
    id: "roleplay",
    type: "visualization",
    label: "Ролевые игры",
    description: "Интерактивные симуляции с принятием решений и последствиями",
    icon: Users,
    color: "#10b981",
    gradient:
      "linear-gradient(115deg, rgba(16,185,129,0.16), rgba(52,211,153,0.1), rgba(5,150,105,0.06))",
    link: "/user-dashboard/visualizations",
  },

  // ========== РАБОТА СО ЗВУКОМ (type: audio) ==========

  dictation: {
    id: "dictation",
    type: "audio",
    label: "Диктовка",
    description: "Голосовой ввод текста с автоматическим форматированием",
    icon: Mic,
    color: "#22c55e",
    gradient:
      "linear-gradient(115deg, rgba(34,197,94,0.16), rgba(16,185,129,0.1), rgba(5,150,105,0.05))",
    link: "/user-dashboard/audio",
  },
  transcription: {
    id: "transcription",
    type: "audio",
    label: "Аудио в текст",
    description:
      "Преобразование загруженных аудиофайлов на различных языках в текст",
    icon: FileAudio,
    color: "#0ea5e9",
    gradient:
      "radial-gradient(ellipse at 20% 80%, rgba(14,165,233,0.12), rgba(56,189,248,0.08), rgba(6,182,212,0.04))",
    link: "/user-dashboard/audio",
  },
  text_to_audio: {
    id: "text_to_audio",
    type: "audio",
    label: "Текст в аудио",
    description:
      "Преобразование текста на различных языках в аудиофайл с возможностью скачивания MP3",
    icon: FileAudio,
    color: "#f59e0b",
    gradient:
      "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(249,115,22,0.12), rgba(234,88,12,0.06))",
    link: "/user-dashboard/audio",
  },
};
