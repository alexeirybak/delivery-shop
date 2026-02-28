import { baseUrl } from "../../../../utils/baseUrl";
import CatalogPage from "./CatalogPage";

const canonicalUrl = `${baseUrl}/catalog`;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Каталог товаров магазина "Северяночка"',
  description: 'Каталог всех товаров магазина "Северяночка"',
  alternates: {
    canonical: canonicalUrl,
  },
  keywords: ["каталог", "товары", "Северяночка"],
  openGraph: {
    title: 'Каталог товаров магазина "Северяночка"',
    description: 'Каталог всех товаров магазина "Северяночка"',
    url: canonicalUrl,
    images: "/og-images/catalog-og.jpg",
  },
};

export default function Catalog() {
  return <CatalogPage />;
}
