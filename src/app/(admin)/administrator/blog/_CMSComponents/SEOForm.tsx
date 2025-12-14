import { SiteSettings, FormData } from "../types/siteSettings";
import FormField from "./FormField";
import CurrentSettings from "./CurrentSettings";
import FormButtons from "./FormButtons";
import { Loader } from "lucide-react";

interface SEOFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  settings: SiteSettings | null;
  saving: boolean;
  handleSave: (e: React.FormEvent) => void;
  reloading?: boolean;
}

export default function SEOForm({
  formData,
  setFormData,
  settings,
  saving,
  handleSave,
  reloading = false,
}: SEOFormProps) {
  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 relative">
      {/* Индикатор перезагрузки в блоке текущих настроек */}
      {reloading && settings && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader className="animate-spin text-primary" />
        </div>
      )}
      
      <div className="space-y-6">
        <FormField
          label="Заголовок сайта (Title)"
          value={formData.siteTitle}
          onChange={(value) => setFormData({ ...formData, siteTitle: value })}
          type="text"
          placeholder="Название вашего сайта"
          hint="Отображается в заголовке браузера и поисковых системах (оптимально 50-60 символов)"
          disabled={reloading}
        />

        <FormField
          label="Мета-описание (Description)"
          value={formData.metaDescription}
          onChange={(value) =>
            setFormData({ ...formData, metaDescription: value })
          }
          type="textarea"
          rows={3}
          placeholder="Краткое описание вашего сайта для поисковых систем"
          hint="Оптимальная длина 150-160 символов. Отображается в сниппете поисковых систем"
          disabled={reloading}
        />

        <FormField
          label="Ключевые слова сайта"
          value={formData.siteKeywords}
          onChange={(value) => setFormData({ ...formData, siteKeywords: value })}
          type="textarea"
          rows={3}
          placeholder="ключевое слово 1, ключевое слово 2, ключевое слово 3"
          hint="Основные ключевые слова, по которым продвигается сайт (не более 10-15 слов)"
          showCommaHint
          disabled={reloading}
        />

        <FormField
          label="Семантическое ядро"
          value={formData.semanticCore}
          onChange={(value) => setFormData({ ...formData, semanticCore: value })}
          type="textarea"
          rows={4}
          placeholder="тематика 1, тематика 2, тематика 3, тематика 4"
          hint="Основные тематики и направления вашего сайта. Используются для структурирования контента"
          showCommaHint
          disabled={reloading}
        />
        
        {settings && (
          <div className="relative">
            <CurrentSettings settings={settings} />
            {reloading && (
              <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
        )}

        <FormButtons saving={saving} disabled={reloading} />
      </div>
    </form>
  );
}