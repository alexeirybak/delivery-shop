import type { Metadata } from "next";
import CategoriesContent from "./_components/CategoriesContent";

export const metadata: Metadata = {
  title: "Рабочая тетрадь | NeuroDidactica AI-платформа",
  description:
    "Управление категориями рабочих тетрадей. Создавайте, редактируйте и организуйте тетради по темам и предметам.",
  keywords: [
    "категории тетрадей",
    "управление тетрадями",
    "организация материалов",
    "тематические тетради",
    "предметные тетради",
    "NeuroDidactica",
  ],
  openGraph: {
    title: "Рабочая тетрадь | NeuroDidactica — AI-платформа для образования",
    description:
      "Рабочая тетрадь. Создавайте тематические разделы для удобной навигации.",
    url: "https://neurodidactica.ru/user-dashboard/categories",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const CategoryPage = () => {
  return <CategoriesContent />;
};

export default CategoryPage;