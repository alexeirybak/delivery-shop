import { useState, useEffect } from "react";
import { SiteSettings, FormData } from "../types/siteSettings";

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    siteTitle: "",
    metaDescription: "",
    siteKeywords: "",
    semanticCore: "",
  });

  const loadSettings = async (isReload = false) => {
    if (isReload) {
      setReloading(true);
    } else {
      setInitialLoading(true);
    }
    
    try {
      const response = await fetch("/administrator/blog/api/site-settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setFormData({
          siteTitle: data.data.siteTitle || "",
          metaDescription: data.data.metaDescription || "",
          siteKeywords: (data.data.siteKeywords || []).join(", "),
          semanticCore: (data.data.semanticCore || []).join(", "),
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    } finally {
      if (isReload) {
        setReloading(false);
      } else {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSettings(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/administrator/blog/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteTitle: formData.siteTitle,
          metaDescription: formData.metaDescription,
          siteKeywords: formData.siteKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
          semanticCore: formData.semanticCore
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Настройки сохранены");
        loadSettings(true); 
      } else {
        alert("Ошибка сохранения");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка сохранения настроек");
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    initialLoading,
    reloading,
    saving,
    formData,
    setFormData,
    handleSave,
    loadSettings,
  };
};
