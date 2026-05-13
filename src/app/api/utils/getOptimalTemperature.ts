export const getOptimalTemperature = (actionOrMode: string): number => {
  switch (actionOrMode) {
    // === НАУЧНЫЕ СТАТЬИ ===
    case "scientific-article-structure":
      return 0.6;
    case "scientific-article-text":
      return 0.7;

    // === ОБРАЗОВАТЕЛЬНЫЕ РЕЖИМЫ ===
    case "chat_education":
      return 0.7;
    case "lecture":
      return 0.75;
    case "syllabus":
      return 0.65;
    case "textbooks":
      return 0.7;
    case "presentation":
      return 0.65;
    case "timeline":
      return 0.65;
    case "interactive":
      return 0.7;
    case "mindmap":
      return 0.65;
    case "practice":
      return 0.7;
    case "laboratory":
      return 0.7;
    case "project":
      return 0.7;
    case "quiz":
      return 0.6;
    case "credit":
      return 0.6;
    case "exams":
      return 0.6;
    case "annotation":
      return 0.65;
    case "comparison":
      return 0.65;
    case "debate":
      return 0.7;

    case "chat_learning":
      return 0.7;
    case "flashcards":
      return 0.65;
    case "glossary":
      return 0.6;
    case "workbook":
      return 0.7;
    case "portfolio":
      return 0.65;
    case "cheatsheets":
      return 0.6;

    case "chat_science":
      return 0.7;
    case "review":
      return 0.6;
    case "literature":
      return 0.6;
    case "systematic":
      return 0.55;
    case "conference":
      return 0.65;
    case "research":
      return 0.6;
    case "experimental":
      return 0.6;
    case "hypothesis":
      return 0.7;
    case "methodology":
      return 0.6;
    case "case":
      return 0.65;

    case "generate":
      return 0.75;
    case "expand":
      return 0.7;
    case "continue":
      return 0.7;
    case "explain":
      return 0.65;
    case "improve":
      return 0.4;
    case "simplify":
      return 0.3;
    case "summarize":
      return 0.2;
    case "translate":
      return 0.5;

    default:
      return 0.65;
  }
};
