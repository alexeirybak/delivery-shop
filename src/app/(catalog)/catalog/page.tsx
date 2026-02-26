import CatalogPage from "./CatalogPage";

export const metadata = {
  title: 'Каталог товаров магазина "Северяночка"',
  description: 'Каталог всех товаров магазина "Северяночка"',
  openGraph: {
    title: 'Каталог товаров магазина "Северяночка"',
    description: 'Каталог всех товаров магазина "Северяночка"',
    images: "/og-images/catalog-og.jpg",
  },
};

export default function Catalog() {
  return <CatalogPage />;
}
