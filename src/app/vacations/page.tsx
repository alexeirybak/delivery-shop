import { Metadata } from "next";
import { baseUrl } from "../../../utils/baseUrl";
import { VacanciesContent } from "./VacanciesContent";

export const metadata: Metadata = {
  title: "Вакансии | Северяночка - работа в сети магазинов",
  description:
    "Актуальные вакансии в компании Северяночка. Продавец-кассир, администратор, товаровед, грузчик, мерчандайзер и другие. Официальное трудоустройство, стабильная зарплата, дружный коллектив.",
  keywords:
    "вакансии, работа, Северяночка, продавец-кассир, администратор, товаровед, грузчик, мерчандайзер, уборщица, трудоустройство, Архангельск",
  openGraph: {
    title: "Вакансии | Северяночка",
    description:
      "Работа в сети магазинов Северяночка. Актуальные вакансии с официальным трудоустройством и стабильной зарплатой.",
    url: `https://${baseUrl}/vacancies`,
    siteName: "Северяночка",
    images: [
      {
        url: "/images/vacancies/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Вакансии Северяночка",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: `https://${baseUrl}/vacancies`,
  },
};

export default function VacanciesPage() {
  return <VacanciesContent />;
}
