import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RegFormProvider } from "./contexts/RegFormContext";
import StatesProvider from "@/store/StatesProvider";
import StoreProvider from "./providers";
import { ProductProvider } from "./contexts/ProductContext";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

async function getSiteSettings() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/site-settings`,
      { cache: "force-cache" }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Ошибка загрузки настроек:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = settings?.siteTitle || "Северяночка";
  const description =
    settings?.metaDescription || "Доставка и покупка продуктов питания";
  const keywords =
    settings?.siteKeywords?.join(", ") || "доставка, продукты, покупка";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogImage = `${baseUrl}/images/banners/banner-action-desk.jpeg`;

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${rubik.variable} font-sans`}>
        <StoreProvider>
          <StatesProvider>
            <RegFormProvider>
              <ProductProvider>
                <Header />
                <Breadcrumbs />
                {children}
                <Footer />
              </ProductProvider>
            </RegFormProvider>
          </StatesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
