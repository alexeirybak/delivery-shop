import type { Metadata } from "next";
import EducationPageContent from "./_components/EducationPageContent";

export const metadata: Metadata = {
  title: "Образование | NeuroDidactica AI-платформа",
  description:
    "Создавайте образовательные курсы с помощью ИИ. Генерация лекций, практических занятий, тестов и учебно-методической документации в реальном времени.",
  keywords: [
    "AI образование",
    "генерация курсов",
    "искусственный интеллект обучение",
    "создание лекций",
    "образовательная платформа",
    "NeuroDidactica",
    "быстрый старт",
  ],
  openGraph: {
    title: "Образование | NeuroDidactica — AI-платформа для образования",
    description:
      "Запустите генерацию полноценного образовательного курса с лекциями, практикой, тестами и документацией за несколько минут.",
    url: "https://neurodidactica.ru/user-dashboard/education",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const EducationPage = () => {
  return <EducationPageContent />;
};

export default EducationPage;
