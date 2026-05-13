import type { Metadata } from "next";
import WritingPageContent from "./_components/WritingPageContent";

export const metadata: Metadata = {
  title: "Генерация письменных работ | NeuroDidactica AI-платформа",
  description:
    "Создавайте учебники с помощью ИИ. Генерация глав, параграфов и полного содержания учебника по вашей структуре и параметрам.",
  keywords: [
    "генерация письменных работв",
    "AI учебник",
    "создание учебника",
    "искусственный интеллект образование",
    "структура учебника",
    "NeuroDidactica",
  ],
  openGraph: {
    title: "Генерация письменных работ | NeuroDidactica — AI-платформа для образования",
    description:
      "Создайте полноценный учебник с главами и параграфами за несколько минут. Настройте структуру, уровень образования и предмет.",
    url: "https://neurodidactica.ru/user-dashboard/textbook",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const WritingPage = () => {
  return <WritingPageContent />;
};

export default WritingPage;