import type { Metadata } from "next";
import LearningPageContent from "./_components/LearningPageContent";

export const metadata: Metadata = {
  title: "Обучение | NeuroDidactica AI-платформа",
  description:
    "Изучайте материалы с помощью ИИ-ассистента. Получайте персонализированные объяснения, ответы на вопросы и помощь в освоении учебного материала.",
  keywords: [
    "AI обучение",
    "помощник студента",
    "искусственный интеллект учеба",
    "объяснение материала",
    "образовательная платформа",
    "NeuroDidactica",
    "учебный ассистент",
  ],
  openGraph: {
    title: "Обучение | NeuroDidactica — AI-помощник для учащихся",
    description:
      "Получайте персонализированную помощь в учебе: объяснения сложных тем, решение задач, подготовка к экзаменам.",
    url: "https://neurodidactica.ru/user-dashboard/learning",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const LearningPage = () => {
  return <LearningPageContent />;
};

export default LearningPage;