import { FileText, BarChart3, Folder, Search } from "lucide-react";

export const stats = [
  {
    title: "Опубликовано",
    value: "0",
    color: "blue",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Категорий",
    value: "0",
    color: "green",
    icon: <Folder className="w-5 h-5" />,
  },
  {
    title: "Ключевых слов",
    value: "0",
    color: "purple",
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: "Просмотров",
    value: "0",
    color: "orange",
    icon: <BarChart3 className="w-5 h-5" />,
  },
];
