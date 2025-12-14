import Link from "next/link";

interface FormButtonsProps {
  saving: boolean;
  disabled?: boolean;
}

export default function FormButtons({ saving, disabled = false }: FormButtonsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t">
      <button
        type="submit"
        disabled={saving || disabled}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {saving ? "Сохранение..." : "Сохранить настройки"}
      </button>
      <Link
        href="/administrator/cms"
        className="px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
      >
        Назад к панели инструментов
      </Link>
    </div>
  );
}