import type { Metadata } from "next";
import RecordsManagementContent from "./_components/RecordsManagementContent";

export const metadata: Metadata = {
  title: "Все записи | NeuroDidactica AI-платформа",
  description:
    "Управление записями рабочих тетрадей. Создавайте, редактируйте и организуйте учебные материалы.",
  keywords: [
    "управление записями",
    "рабочие тетради",
    "учебные материалы",
    "редактирование записей",
    "организация контента",
    "NeuroDidactica",
  ],
  openGraph: {
    title: "Все записи | NeuroDidactica — AI-платформа для образования",
    description:
      "Управляйте записями в рабочих тетрадях. Создавайте и редактируйте учебные материалы.",
    url: "https://neurodidactica.ru/user-dashboard/records",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const RecordsManagement = () => {
  return <RecordsManagementContent />;
};

export default RecordsManagement;