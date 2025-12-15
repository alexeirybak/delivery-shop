// app/administrator/cms/_components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
            
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  // Добавляем главную
  breadcrumbs.push({ label: "Главная", href: "/" });
  
  // Собираем путь
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Преобразуем slug в читаемое название
    const label = getLabel(segment);
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    });
  });
  
  return breadcrumbs;
}

function getLabel(segment: string): string {
  const labels: Record<string, string> = {
    'administrator': 'Админ-панель',
    'cms': 'CMS',
    'seo': 'SEO',
    'semantic-core': 'Семантическое ядро',
    'blog': 'Блог',
    'categories': 'Категории',
    'posts': 'Статьи',
    'create': 'Создание',
    'edit': 'Редактирование',
  };
  
  return labels[segment] || 
    segment.charAt(0).toUpperCase() + segment.slice(1);
}