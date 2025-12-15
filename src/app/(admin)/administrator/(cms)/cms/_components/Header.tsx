// components/PageHeader.tsx (упрощенный)
interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 mt-2">
          {description}
        </p>
      )}
    </header>
  );
}