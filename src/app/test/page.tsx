import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тест OG",
  description: "Тест OpenGraph изображения",
  openGraph: {
    title: "Тест OG",
    description: "Тест OpenGraph изображения",
    type: "website",
    url: "http://localhost:3000/test",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
        width: 1200,
        height: 630,
        alt: "Тест",
      },
    ],
  },
};

export default function TestPage() {
  return (
    <div>
      <h1>Тест OpenGraph</h1>
      <p>Проверьте исходный код страницы</p>
    </div>
  );
}