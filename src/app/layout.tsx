import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RegFormProvider } from "./contexts/RegFormContext";
import StatesProvider from "@/store/StatesProvider";
import { generateSiteMetadata } from "../../utils/generateSiteMetadata";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${rubik.variable} font-sans`}>
        <StatesProvider>
          <RegFormProvider>
            <Header />
            <Breadcrumbs />
            {children}
            <Footer />
          </RegFormProvider>
        </StatesProvider>
      </body>
    </html>
  );
}
