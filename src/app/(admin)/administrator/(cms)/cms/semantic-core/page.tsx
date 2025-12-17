"use client";

import { Loader, Loader2 } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import Header from "../_components/Header";
import SEOForm from "./_components/SEOForm";
import SEORecommendations from "./_components/SEORecommendations";

const SemanticCorePage = () => {
  const { settings, loading, saving, formData, handleSave, setFormData } =
    useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  return (
    <>
      {saving && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md">
            <Loader2 className="animate-spin h-4 w-4" />
            <span className="text-sm">Сохранение...</span>
          </div>
        </div>
      )}
      <Header
        title="SEO настройки сайта"
        description="Настройки ключевых слов и семантического ядра для всего сайта"
      />
      <SEOForm
        formData={formData}
        setFormData={setFormData}
        settings={settings}
        saving={saving}
        handleSave={handleSave}
      />
      <SEORecommendations />
    </>
  );
};

export default SemanticCorePage;