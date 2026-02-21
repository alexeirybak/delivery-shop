import { Metadata } from "next";
import { VacationsContent } from "./VacationsContent";
import { baseUrl } from "../../../utils/baseUrl";

export const metadata: Metadata = {
  title: "Вакансии | Северяночка",
  description:
    "Актуальные вакансии в компании Северяночка. Продавец-кассир, администратор магазина, товаровед, грузчик-комплектовщик, мерчандайзер, уборщица. Официальное трудоустройство, стабильная зарплата, дружный коллектив.",
  openGraph: {
    title: "Вакансии | Северяночка",
    description:
      "Работа в стабильной компании. Продавец-кассир от 50 000 руб., администратор от 70 000 руб., товаровед от 60 000 руб. и другие вакансии.",
    url: `${baseUrl}/vacations`,
    siteName: "Северяночка",
    images: [
      {
        url: `${baseUrl}/images/vacations/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Вакансии Северяночка",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "/vacations",
  },
  keywords:
    "вакансии, работа, продавец-кассир, администратор магазина, товаровед, грузчик, мерчандайзер, уборщица, трудоустройство, Северяночка",
};

export default function VacationsPage() {
  return <VacationsContent />;
}
