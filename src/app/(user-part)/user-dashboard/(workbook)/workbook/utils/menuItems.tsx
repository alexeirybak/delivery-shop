import { FileText, FolderTree, Home, Plus } from "lucide-react";

export const menuItems = [
  {
    id: "workbook-home",
    title: "Рабочие тетради",
    description: "Главная страница управления контентом",
    icon: <Home className="w-6 h-6" />,
    color: "from-gray-500 to-gray-600",
    hoverColor: "hover:from-gray-600 hover:to-gray-700",
    shadow: "shadow-lg shadow-gray-500/20",
    path: "/user-dashboard/workbook",
  },
  {
    id: "new-record",
    title: "Новая запись",
    description: "Создать запись в редакторе",
    icon: <Plus className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
    shadow: "shadow-lg shadow-blue-500/20",
    path: "/user-dashboard/records",
  },
  {
    id: "all-records",
    title: "Все записи",
    description: "Просмотр и управление записями",
    icon: <FileText className="w-6 h-6" />,
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
    shadow: "shadow-lg shadow-indigo-500/20",
    path: "/user-dashboard/records-management",
  },
  {
    id: "categories",
    title: "Полка для тетрадей",
    description: "Управление тетрадями",
    icon: <FolderTree className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    hoverColor: "hover:from-green-600 hover:to-green-700",
    shadow: "shadow-lg shadow-green-500/20",
    path: "/user-dashboard/categories",
  },
];
