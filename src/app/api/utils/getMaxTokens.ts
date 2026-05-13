export const getMaxTokens = (actionOrMode: string): number => {
  switch (actionOrMode) {
    case "scientific-article-structure":
      return 3000;
    case "scientific-article-text":
      return 32767;

    case "chat_education":
      return 5000;
    case "lecture":
      return 15000;
    case "syllabus":
      return 15000;
    case "textbooks":
      return 32767;
    case "presentation":
      return 6000;
    case "timeline":
      return 4000;
    case "interactive":
      return 6000;
    case "mindmap":
      return 4000;
    case "practice":
      return 6000;
    case "laboratory":
      return 6000;
    case "project":
      return 6000;
    case "quiz":
      return 4000;
    case "credit":
      return 10000;
    case "exams":
      return 10000;
    case "annotation":
      return 5000;
    case "comparison":
      return 4000;
    case "debate":
      return 5000;

    // === ДЛЯ САМОСТОЯТЕЛЬНОГО ОБУЧЕНИЯ ===
    case "chat_learning":
      return 3000;
    case "flashcards":
      return 3000;
    case "glossary":
      return 4000;
    case "workbook":
      return 6000;
    case "portfolio":
      return 4000;
    case "cheatsheets":
      return 2000;

    // === НАУЧНЫЕ РЕЖИМЫ (mode) ===
    case "chat_science":
      return 3000;
    case "review":
      return 8000;
    case "literature":
      return 8000;
    case "systematic":
      return 10000;
    case "conference":
      return 3000;
    case "research":
      return 8000;
    case "experimental":
      return 8000;
    case "hypothesis":
      return 5000;
    case "methodology":
      return 6000;
    case "case":
      return 6000;

    // === ДЕЙСТВИЯ (actions) ===
    case "generate":
      return 8000;
    case "improve":
      return 8000;
    case "simplify":
      return 5000;
    case "summarize":
      return 5000;

    default:
      return 8000;
  }
};
