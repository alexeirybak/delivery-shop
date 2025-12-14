import { SiteSettings } from "../types/siteSettings";

interface CurrentSettingsProps {
  settings: SiteSettings;
}

export default function CurrentSettings({ settings }: CurrentSettingsProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Текущие настройки:</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div>
          <strong>Заголовок:</strong> {settings.siteTitle}
        </div>
        <div>
          <strong>Ключевых слов:</strong> {settings.siteKeywords?.length || 0}
        </div>
        <div>
          <strong>Тематик:</strong> {settings.semanticCore?.length || 0}
        </div>
        <div>
          <strong>Обновлено:</strong>{" "}
          {new Date(settings.updatedAt).toLocaleString("ru-RU")}
        </div>
      </div>
    </div>
  );
}
