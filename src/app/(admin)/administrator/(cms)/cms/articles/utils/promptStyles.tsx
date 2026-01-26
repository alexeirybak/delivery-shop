import { Brush, Camera, Palette, Sparkles, Zap } from "lucide-react";
import { StyleOption } from "../types/ai/image-ai.types";

export const promptStyles: StyleOption[] = [
  {
    id: "default",
    label: "Авто",
    icon: <Sparkles className="w-4 h-4" />,
    color: "text-gray-600",
  },
  {
    id: "realistic",
    label: "Реализм",
    icon: <Camera className="w-4 h-4" />,
    color: "text-green-600",
  },
  {
    id: "artistic",
    label: "Арт",
    icon: <Brush className="w-4 h-4" />,
    color: "text-purple-600",
  },
  {
    id: "sketch",
    label: "Эскиз",
    icon: <Zap className="w-4 h-4" />,
    color: "text-orange-600",
  },
  {
    id: "cartoon",
    label: "Мульт",
    icon: <Palette className="w-4 h-4" />,
    color: "text-green-600",
  },
];