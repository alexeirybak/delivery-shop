import type { Metadata } from "next";
import VisualizationPageContent from "./_components/VisualizationPageContent";

export const metadata: Metadata = {
  title: "Визуализации | NeuroDidactica AI-платформа",
  description:
    "Создавайте наглядные визуализации с помощью ИИ. Ментальные карты, блок-схемы, диаграммы, сетевые графы и другие графические представления данных.",
  keywords: [
    "AI визуализация",
    "ментальные карты",
    "блок-схемы",
    "диаграммы",
    "графики",
    "сетевые графы",
    "визуализация данных",
    "инфографика",
    "NeuroDidactica",
    "генерация схем",
  ],
  openGraph: {
    title: "Визуализации | NeuroDidactica — AI-платформа для создания графики",
    description:
      "Создавайте ментальные карты, блок-схемы, диаграммы и сетевые графы с помощью искусственного интеллекта. Визуализируйте сложные концепции за несколько минут.",
    url: "https://neurodidactica.ru/user-dashboard/visualizations",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const VisualizationPage = () => {
  return <VisualizationPageContent />;
};

export default VisualizationPage;