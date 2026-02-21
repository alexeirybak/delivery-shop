import { Metadata } from "next";
import { AboutUsContent } from "./AboutUsContent";
import { baseUrl } from "../../../utils/baseUrl";

export const metadata: Metadata = {
  title: "О компании | Северяночка",
  description:
    "Узнайте больше о компании Северяночка. Более 20 лет на рынке розничной торговли. Здоровая и полезная продукция местного производства. Максимальное качество товаров и услуг по доступной цене.",
  openGraph: {
    title: "О компании | Северяночка",
    description:
      "Более 20 лет на рынке розничной торговли. Здоровая и полезная продукция местного производства.",
    url: `${baseUrl}/about-us`,
    siteName: "Северяночка",
    images: [
      {
        url: `${baseUrl}/images/about-us/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "О компании Северяночка",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "/about-us",
  },
  keywords:
    "о компании, северяночка, розничная торговля, местная продукция, качественные товары, доступные цены",
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
