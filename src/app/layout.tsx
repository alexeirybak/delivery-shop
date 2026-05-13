import type { Metadata } from "next";
import { RegFormProvider } from "./contexts/RegFormContext";
import { Header } from "./shared/header/Header";
import ScrollToTop from "./shared/scrollToTop/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";
import CookieConsent from "./cookie/CookieConsent";

export const metadata: Metadata = {
  title: "NeuroDidactica",
  description: "Лаборатория нейродидактики гуманитарного института САФУ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-body">
        <ThemeProvider>
          <RegFormProvider>
            <Header />
            {children}
          </RegFormProvider>
          <CookieConsent />
        </ThemeProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
