import {
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquare,
  MessagesSquare,
  Presentation,
  Library,
  Clock,
  Layers,
  NotebookPen,
  FolderOpen,
  Sparkles,
  ScrollText,
  Scale,
  Sword,
  Brain,
  GitBranch,
  CalendarCheck,
  FlaskConical,
  FolderKanban,
  PenTool,
  TestTube,
  Microscope,
  Briefcase,
  Search,
  Settings,
  Beaker,
  FileCheck,
  Workflow,
  Network,
  BarChart,
  PieChart,
  LineChart,
  Radar,
  Table,
  GitMerge,
  Compass,
  Mic,
  FileAudio,
  Heart,
  BookCopy,
  Gamepad2,
  BookA,
} from "lucide-react";

export const ModeIcon = ({ mode }: { mode: string }) => {
  const iconProps = {
    size: 18,
    strokeWidth: 1.5,
  };

  const iconColor =
    {
      // ========== EDUCATION ==========
      chat_education: "#60c50a",
      syllabus: "#8b5cf6",
      annotation: "#14b8a6",
      homework_check: "#f97316",
      lecture: "#f59e0b",
      practice: "#10b981",
      laboratory: "#06b6d4",
      interactive: "#d946ef",
      debate: "#ec489a",
      project: "#ef4444",
      comparison: "#f59e0b",
      presentation: "#a855f7",
      quiz: "#ec489a",
      credit: "#10b981",
      exams: "#8b5cf6",

      // ========== SCIENCE ==========
      chat_science: "#60c50a",
      conference: "#8b5cf6",
      review: "#14b8a6",
      research: "#f59e0b",
      experimental: "#ec489a",
      methodology: "#0ea5e9",
      case: "#ef4444",
      literature: "#06b6d4",
      systematic: "#6366f1",
      hypothesis: "#a855f7",

      // ========== LEARNING ==========
      chat_learning: "#60c50a",
      psychological_support: "#ec489a",
      solution_book: "#22c55e",
      cheatsheets: "#f97316",

      // ========== WRITING ==========
      essay: "#f59e0b",
      test: "#ef4444",
      coursework: "#8b5cf6",
      report: "#10b981",
      thesis: "#ec489a",
      textbooks: "#22c55e", // ← добавлено
      roleplay: "#ec489a", // ← добавлено
      glossary: "#f59e0b", // ← добавлено

      // ========== VISUALIZATION ==========
      mindmap: "#a855f7",
      flowchart: "#10b981",
      network: "#ec489a",
      barchart: "#f59e0b",
      piechart: "#ef4444",
      linechart: "#3b82f6",
      radarchart: "#8b5cf6",
      visualization_comparison: "#14b8a6",
      roadmap: "#d946ef",
      hierarchy: "#06b6d4",
      timeline: "#10b981",
      flashcards: "#f97316",

      // ========== AUDIO ==========
      dictation: "#22c55e",
      transcription: "#0ea5e9",
      text_to_audio: "#f59e0b",
    }[mode] || "#6b7280";

  switch (mode) {
    // ========== EDUCATION ==========
    case "chat_education":
      return <MessagesSquare {...iconProps} color={iconColor} />;
    case "lecture":
      return <GraduationCap {...iconProps} color={iconColor} />;
    case "syllabus":
      return <Library {...iconProps} color={iconColor} />;
    case "annotation":
      return <ScrollText {...iconProps} color={iconColor} />;
    case "textbooks":
      return <BookCopy {...iconProps} color={iconColor} />;
    case "practice":
      return <CalendarCheck {...iconProps} color={iconColor} />;
    case "laboratory":
      return <FlaskConical {...iconProps} color={iconColor} />;
    case "interactive":
      return <Brain {...iconProps} color={iconColor} />;
    case "project":
      return <FolderKanban {...iconProps} color={iconColor} />;
    case "presentation":
      return <Presentation {...iconProps} color={iconColor} />;
    case "quiz":
      return <TestTube {...iconProps} color={iconColor} />;
    case "credit":
      return <FileCheck {...iconProps} color={iconColor} />;
    case "exams":
      return <GraduationCap {...iconProps} color={iconColor} />;
    case "comparison":
      return <Scale {...iconProps} color={iconColor} />;
    case "debate":
      return <Sword {...iconProps} color={iconColor} />;
    case "homework_check":
      return <FileCheck {...iconProps} color={iconColor} />;

    // ========== SCIENCE ==========
    case "chat_science":
      return <MessagesSquare {...iconProps} color={iconColor} />;
    case "conference":
      return <Presentation {...iconProps} color={iconColor} />;
    case "review":
      return <FileText {...iconProps} color={iconColor} />;
    case "research":
      return <Microscope {...iconProps} color={iconColor} />;
    case "experimental":
      return <Beaker {...iconProps} color={iconColor} />;
    case "methodology":
      return <Settings {...iconProps} color={iconColor} />;
    case "case":
      return <Briefcase {...iconProps} color={iconColor} />;
    case "literature":
      return <Library {...iconProps} color={iconColor} />;
    case "systematic":
      return <Search {...iconProps} color={iconColor} />;
    case "hypothesis":
      return <Sparkles {...iconProps} color={iconColor} />;

    // ========== LEARNING ==========
    case "chat_learning":
      return <MessagesSquare {...iconProps} color={iconColor} />;
    case "solution_book":
      return <PenTool {...iconProps} color={iconColor} />;
    case "flashcards":
      return <Layers {...iconProps} color={iconColor} />;
    case "glossary":
      return <BookA {...iconProps} color={iconColor} />;
    case "workbook":
      return <NotebookPen {...iconProps} color={iconColor} />;
    case "portfolio":
      return <FolderOpen {...iconProps} color={iconColor} />;
    case "cheatsheets":
      return <Sparkles {...iconProps} color={iconColor} />;
    case "psychological_support":
      return <Heart {...iconProps} color={iconColor} />;
    case "roleplay":
      return <Gamepad2 {...iconProps} color={iconColor} />;

    // ========== WRITING ==========
    case "essay":
      return <PenTool {...iconProps} color={iconColor} />;
    case "test":
      return <FileCheck {...iconProps} color={iconColor} />;
    case "coursework":
      return <BookOpen {...iconProps} color={iconColor} />;
    case "report":
      return <ScrollText {...iconProps} color={iconColor} />;
    case "thesis":
      return <GraduationCap {...iconProps} color={iconColor} />;

    // ========== VISUALIZATION ==========
    case "mindmap":
      return <GitBranch {...iconProps} color={iconColor} />;
    case "flowchart":
      return <Workflow {...iconProps} color={iconColor} />;
    case "network":
      return <Network {...iconProps} color={iconColor} />;
    case "barchart":
      return <BarChart {...iconProps} color={iconColor} />;
    case "piechart":
      return <PieChart {...iconProps} color={iconColor} />;
    case "linechart":
      return <LineChart {...iconProps} color={iconColor} />;
    case "radarchart":
      return <Radar {...iconProps} color={iconColor} />;
    case "visualization_comparison":
      return <Table {...iconProps} color={iconColor} />;
    case "roadmap":
      return <Compass {...iconProps} color={iconColor} />;
    case "hierarchy":
      return <GitMerge {...iconProps} color={iconColor} />;
    case "timeline":
      return <Clock {...iconProps} color={iconColor} />;

    // ========== AUDIO ==========
    case "dictation":
      return <Mic {...iconProps} color={iconColor} />;
    case "transcription":
      return <FileAudio {...iconProps} color={iconColor} />;
    case "text_to_audio":
      return <FileAudio {...iconProps} color={iconColor} />;

    default:
      return <MessageSquare {...iconProps} color={iconColor} />;
  }
};
