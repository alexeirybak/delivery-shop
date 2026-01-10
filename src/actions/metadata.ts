"use server";

import { baseUrl } from "../../utils/baseUrl";



export async function getHomeMetadata() {
  // В dev-режиме возвращаем статику
  if (process.env.NODE_ENV === 'development') {
    return {
      title: "Северяночка - Главная-преглавная",
      description: "Доставка продуктов на дом. Свежие продукты, акции и спецпредложения.",
      keywords: "доставка продуктов, продукты на дом, купить продукты онлайн",
    };
  }
  
  try {
    const res = await fetch(`${baseUrl}/administrator/cms/api/site-settings`);
    
    if (res.ok) {
      const result = await res.json();
      
      if (result.success && result.data) {
        const settings = result.data;
        return {
          title: settings.siteTitle ? `${settings.siteTitle} - Главная` : "Северяночка - Главная",
          description: settings.metaDescription || "Доставка продуктов на дом",
          keywords: settings.siteKeywords?.join(", ") || "доставка продуктов",
        };
      }
    }
  } catch (error) {
    console.error("Ошибка загрузки метаданных:", error);
  }
  
  return {
    title: "Северяночка - Главная",
    description: "Доставка продуктов на дом",
    keywords: "доставка продуктов",
  };
}