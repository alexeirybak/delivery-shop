import { Plus, FolderTree, Tags, FileText } from "lucide-react";
import { DashboardCard } from "../types/dashboard";

export const dashboardCards: DashboardCard[] = [
  {
    id: "new-article",
    title: "Новая статья",
    description: "Создать статью в редакторе",
    icon: <Plus className="w-6 h-6" />,
    color: "blue",
    path: "/administrator/cms/articles/editor",
    actionText: "Создать",
  },
  {
    id: "all-articles",
    title: "Все статьи",
    description: "Просмотр и управление статьями",
    icon: <FileText className="w-6 h-6" />,
    color: "indigo",
    path: "/administrator/cms/articles/articlesManagement",
    actionText: "Перейти",
  },
  {
    id: "categories",
    title: "Категории",
    description: "Управление категориями блога",
    icon: <FolderTree className="w-6 h-6" />,
    color: "green",
    path: "/administrator/cms/categories",
    actionText: "Управлять",
  },
  {
    id: "semantic-core",
    title: "Семантическое ядро",
    description: "Ключевые слова и SEO",
    icon: <Tags className="w-6 h-6" />,
    color: "purple",
    path: "/administrator/cms/semantic-core",
    actionText: "Настроить",
  },
];