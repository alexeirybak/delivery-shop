import { Square, Tv, Monitor, Clapperboard } from "lucide-react";

export const aspectRatios = [
  {
    id: "1:1" as const,
    label: "Квадрат",
    icon: <Square size={20} />,
    desc: "1:1 - Instagram, аватарки",
  },
  {
    id: "16:9" as const,
    label: "Широкий",
    icon: <Tv size={20} />,
    desc: "16:9 - YouTube, презентации",
  },
  {
    id: "16:10" as const,
    label: "Экран",
    icon: <Monitor size={20} />,
    desc: "16:10 - мониторы, ноутбуки",
  },
  {
    id: "21:9" as const,
    label: "Кино",
    icon: <Clapperboard size={20} />,
    desc: "21:9 - ультраширокий, кино",
  },
];