import {
  Plus,
  FolderTree,
  FileText,
} from "lucide-react";
import { DashboardCard } from "../types";

export const dashboardCards: DashboardCard[] = [
  {
    id: "new-record",
    title: "Новая запись",
    description: "Создать запись в редакторе",
    icon: <Plus className="w-6 h-6" />,
    color: "blue",
    path: "/user-dashboard/records",
    actionText: "Создать",
  },
  {
    id: "all-records",
    title: "Все записи",
    description: "Просмотр и управление записями",
    icon: <FileText className="w-6 h-6" />,
    color: "indigo",
    path: "/user-dashboard/records-management",
    actionText: "Перейти",
  },
  {
    id: "categories",
    title: "Полка для тетрадей",
    description: "Создание и удаление тетрадей, управление тетрадями",
    icon: <FolderTree className="w-6 h-6" />,
    color: "green",
    path: "/user-dashboard/categories",
    actionText: "Управлять тетрадями",
  },
];
