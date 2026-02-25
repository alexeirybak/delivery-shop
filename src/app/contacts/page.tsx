import { Metadata } from "next";
import { baseUrl } from "../../../utils/baseUrl";
import { ContactsContent } from "./ContactsContent";

export const metadata: Metadata = {
  title: "Контакты | Северяночка - адреса магазинов и телефоны",
  description:
    "Контакты компании Северяночка. Адреса магазинов в Архангельске, телефоны бухгалтерии, склада и отдела лояльности. Схема проезда и часы работы.",
  keywords:
    "контакты, Северяночка, адреса магазинов, телефоны, Архангельск, бухгалтерия, склад, карта проезда, система лояльности",
  openGraph: {
    title: "Контакты | Северяночка",
    description: "Адреса магазинов и контактные телефоны компании Северяночка",
    url: `https://${baseUrl}/contacts`,
    siteName: "Северяночка",
    images: [
      {
        url: "/images/contacts/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Контакты Северяночка",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: `https://${baseUrl}/contacts`,
  },
};

export default function ContactsPage() {
  return <ContactsContent />;
}
