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

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: "Северяночка",
  description: "Доставка и покупка продуктов питания",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
