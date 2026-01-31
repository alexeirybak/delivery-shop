import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RegFormProvider } from "./contexts/RegFormContext";
import StatesProvider from "@/store/StatesProvider";
import StoreProvider from "./provider";
import { ProductProvider } from "./contexts/ProductContext";
import { generateSiteMetadata } from "../../utils/generateSiteMetadata";
import { CategoryProvider } from "./contexts/CategoryContext";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  return await generateSiteMetadata();
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
                <CategoryProvider>
                  <Header />
                  <Breadcrumbs />
                  {children}
                  <Footer />
                </CategoryProvider>
              </ProductProvider>
            </RegFormProvider>
          </StatesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
