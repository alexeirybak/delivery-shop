import type { Metadata } from "next";
import WorkbookPage from "./_components/WorkbookPage";

export const metadata: Metadata = {
  title: "Рабочая тетрадь | NeuroDidactica AI-платформа",
  description:
    "Создавайте рабочие тетради с помощью ИИ. Генерация упражнений, заданий и материалов для практических занятий.",
  keywords: [
    "рабочая тетрадь",
    "генерация заданий",
    "AI рабочая тетрадь",
    "создание рабочей тетради",
    "искусственный интеллект образование",
    "упражнения",
    "практические задания",
    "NeuroDidactica",
  ],
  openGraph: {
    title: "Рабочая тетрадь | NeuroDidactica — AI-платформа для образования",
    description:
      "Создайте рабочую тетрадь с упражнениями и заданиями за несколько минут. Настройте тип заданий, сложность и тему.",
    url: "https://neurodidactica.ru/user-dashboard/workbook",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const WorkBook = () => {
  return <WorkbookPage />;
};

export default WorkBook;
