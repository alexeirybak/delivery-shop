"use client";

import { Loader } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOForm from "../_CMSComponents/SEOForm";
import SEORecommendations from "../_CMSComponents/SEORecommendations";

export default function SemanticCorePage() {
  const {
    settings,
    loading,
    saving,
    formData,
    handleSave,
    setFormData,
  } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      {saving && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md">
            <Loader className="animate-spin h-4 w-4" />
            <span className="text-sm">Сохранение...</span>
          </div>
        </div>
      )}
      
      <Breadcrumbs />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          SEO настройки сайта
        </h1>
        <p className="text-gray-600 mt-2">
          Настройки ключевых слов и семантического ядра для всего сайта
        </p>
      </header>

      <SEOForm
        formData={formData}
        setFormData={setFormData}
        settings={settings}
        saving={saving}
        handleSave={handleSave}
      />

      <SEORecommendations />
    </main>
  );
}