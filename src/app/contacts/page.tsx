import { Metadata } from "next";
import { baseUrl } from "../../../utils/baseUrl";
import { ContactsContent } from "./ContactsContent";

export const metadata: Metadata = {
  title: "Контакты | Северяночка - адреса магазинов и телефоны",
  description:
    "Контакты компании Северяночка. Адреса магазинов в Архангельске, телефоны бухгалтерии, склада и отдела лояльности. Схема проезда и часы работы.",
  keywords:
    "контакты, Северяночка, адреса магазинов, телефоны, Архангельск, бухгалтерия, склад, карта проезда, система лояльности",
  alternates: {
    canonical: `${baseUrl}/contacts`,
  },
  openGraph: {
    title: "Контакты | Северяночка",
    description: "Адреса магазинов и контактные телефоны компании Северяночка",
    url: `${baseUrl}/contacts`,
    siteName: "Северяночка",
    images: {
      url: "/og-images/contacts-og.jpg",
      width: 512,
      height: 512,
      alt: "Контакты Северяночка",
    },
  },
};

export default function ContactsPage() {
  return <ContactsContent />;
}
