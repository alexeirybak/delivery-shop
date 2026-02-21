import { Metadata } from "next";
import { baseUrl } from "../../../utils/baseUrl";
import { ContactsContent } from "./ContactsContent";

export const metadata: Metadata = {
  title: "Контакты | Магазин",
  description:
    "Контактная информация, адреса магазинов и телефоны. Бухгалтерия, склад, вопросы по системе лояльности.",
  openGraph: {
    title: "Контакты | Магазин",
    description: "Контактная информация, адреса магазинов и телефоны",
    url: `${baseUrl}/contacts`,
    siteName: "Магазин",
    images: [
      {
        url: `${baseUrl}/images/og-contacts.jpg`,
        width: 1200,
        height: 630,
        alt: "Контакты магазина",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "/contacts",
  },
};

export default function ContactsPage() {
  return <ContactsContent />;
}
