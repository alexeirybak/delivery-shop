import Link from "next/link";

export default function Breadcrumbs() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Link
          href="/administrator/blog"
          className="hover:text-primary hover:underline"
        >
          Статьи
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">SEO настройки сайта</span>
      </div>
    </div>
  );
}
