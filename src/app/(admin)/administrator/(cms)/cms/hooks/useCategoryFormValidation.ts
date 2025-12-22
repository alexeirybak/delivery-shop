import { useState } from "react";
import { SEO_LIMITS } from "../utils/seo-limits";
import { CategoryFormData } from "../types";

export const useCategoryFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Валидация одного поля
  const validateField = (field: keyof CategoryFormData, value: string): string => {
    switch (field) {
      case "name":
        if (value.length < SEO_LIMITS.name.min || value.length > SEO_LIMITS.name.max) {
          return SEO_LIMITS.name.message;
        }
        return "";

      case "slug":
        if (value.length < SEO_LIMITS.slug.min || value.length > SEO_LIMITS.slug.max) {
          return `Slug должен быть от ${SEO_LIMITS.slug.min} до ${SEO_LIMITS.slug.max} символов`;
        }
        // Проверяем только базовые требования (можно упростить)
        const hasInvalidChars = /[^a-z0-9-]/.test(value);
        const startsOrEndsWithDash = value.startsWith('-') || value.endsWith('-');
        
        if (hasInvalidChars || startsOrEndsWithDash) {
          return "Только латинские буквы, цифры и дефисы. Не должен начинаться или заканчиваться дефисом.";
        }
        return "";

      case "description":
        if (value && (value.length < SEO_LIMITS.description.min || value.length > SEO_LIMITS.description.max)) {
          return SEO_LIMITS.description.message;
        }
        return "";

      case "keywords":
        if (value) {
          const keywordsArray = value
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0);

          if (keywordsArray.length > SEO_LIMITS.keywords.maxCount) {
            return `Максимум ${SEO_LIMITS.keywords.maxCount} ключевых слов`;
          }

          if (value.length > SEO_LIMITS.keywords.maxLength) {
            return SEO_LIMITS.keywords.message;
          }
        }
        return "";

      default:
        return "";
    }
  };

  // Валидация всей формы (для отправки)
  const validateForm = (formData: CategoryFormData): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof CategoryFormData, formData[field as keyof CategoryFormData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обновление ошибки для конкретного поля
  const updateFieldError = (field: keyof CategoryFormData, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    validateField,
    updateFieldError,
    clearErrors,
    clearError,
    setErrors,
  };
};