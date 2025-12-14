"use client";

import { Loader } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOForm from "../_CMSComponents/SEOForm";
import SEORecommendations from "../_CMSComponents/SEORecommendations";

export default function SemanticCorePage() {
  const {
    settings,
    initialLoading,
    reloading,
    saving,
    formData,
    handleSave,
    setFormData,
  } = useSiteSettings();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Показываем небольшой лоадер при перезагрузке поверх контента */}
        {reloading && <Loader />}

        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SEO настройки сайта
          </h1>
          <p className="text-gray-600 mt-2">
            Настройки ключевых слов и семантического ядра для всего сайта
          </p>
        </div>

        <SEOForm
          formData={formData}
          setFormData={setFormData}
          settings={settings}
          saving={saving}
          handleSave={handleSave}
          reloading={reloading}
        />

        <SEORecommendations />
      </div>
    </div>
  );
}
