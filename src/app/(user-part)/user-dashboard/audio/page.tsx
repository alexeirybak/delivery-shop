import type { Metadata } from "next";
import AudioPageContent from "./_components/AudioPageContent";

export const metadata: Metadata = {
  title: "Работа со звуком | NeuroDidactica AI-платформа",
  description:
    "Диктовка, транскрибация аудио и преобразование текста в речь. Голосовой ввод с автоматическим форматированием, распознавание речи из файлов и синтез речи.",
  keywords: [
    "диктовка",
    "голосовой ввод",
    "транскрибация аудио",
    "аудио в текст",
    "текст в аудио",
    "распознавание речи",
    "синтез речи",
    "озвучивание текста",
    "голосовой ассистент",
    "NeuroDidactica",
    "работа со звуком",
  ],
  openGraph: {
    title: "Работа со звуком | NeuroDidactica — Голосовой ввод, транскрибация и синтез речи",
    description:
      "Преобразуйте голос в текст, транскрибируйте аудиофайлы и создавайте аудио из текста с помощью ИИ.",
    url: "https://neurodidactica.ru/user-dashboard/audio",
    siteName: "NeuroDidactica",
    locale: "ru_RU",
    type: "website",
  },
};

const AudioPage = () => {
  return <AudioPageContent />;
};

export default AudioPage;