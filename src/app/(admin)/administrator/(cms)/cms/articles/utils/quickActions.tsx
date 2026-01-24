import { FileText, Languages, Sparkles, Type, Wand2, Zap } from "lucide-react";

export const quickActions = [
  {
    id: "improve",
    label: "Улучшить",
    icon: <Wand2 className="w-5 h-5" />,
    desc: "Сделать текст лучше",
    color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "continue",
    label: "Продолжить",
    icon: <Sparkles className="w-5 h-5" />,
    desc: "Продолжить текст",
    color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
  },
  {
    id: "summarize",
    label: "Сократить",
    icon: <FileText className="w-5 h-5" />,
    desc: "Сделать кратко",
    color: "text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    id: "expand",
    label: "Расширить",
    icon: <Zap className="w-5 h-5" />,
    desc: "Добавить детали",
    color: "text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    id: "simplify",
    label: "Упростить",
    icon: <Type className="w-5 h-5" />,
    desc: "Сделать проще",
    color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
  },
  {
    id: "translate",
    label: "Перевести",
    icon: <Languages className="w-5 h-5" />,
    desc: "Перевести текст",
    color: "text-red-600 bg-red-50 hover:bg-red-100",
  },
] as const;
