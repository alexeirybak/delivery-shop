"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ArticleForm from "./_components/ArticleForm";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import { useArticles } from "../articles/hooks/useArticles";
import ProcessInfo from "./_components/ProcessInfo";
import { ARTICLE_GENERATION_PROMPT } from "./utils/textPrompt";
import { cleanGeneratedHtml } from "./utils/cleanGeneratedHtml";
import { transliterate } from "../../../../../../../utils/transliterate";
import { ArticleFormData } from "../articles/types";
import { ArticleData } from "./types/auto-generate.types";
import {
  generateArticleImages,
  updateArticleWithImages,
} from "./utils/imageGeneration";
import { GenerationStatusPanel } from "./_components/GenerationStatusPanel";

const AutoGeneratePage = () => {
  const { createArticle } = useArticles();
  const { categories, loadCategories } = useCategoryStore();
  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const [topic, setTopic] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "loading" | "success" | "error"
  >("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("1");
  const [currentStepName, setCurrentStepName] = useState<string>(
    "Основное изображение",
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (generationStatus === "generating" || generationStatus === "loading") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (generationStatus === "idle" || generationStatus === "success") {
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generationStatus]);

  useEffect(() => {
    loadCategories({ unlimited: true });
  }, [loadCategories]);

  const handleCategorySelect = (categoryId: string) => {
    const selected = categories.find((cat) => cat._id === categoryId);
    if (selected) {
      setCategoryId(selected._id);
      setCategoryName(selected.name);
      setCategorySlug(selected.slug);
      setIsCategoryOpen(false);
    }
  };

  const generateImagesInBackground = useCallback(
    async (articleId: string, topic: string, articleData: ArticleData) => {
      try {
        setGenerationStatus("generating");
        setCurrentStep("1");
        setCurrentStepName("Основное изображение");

        const images = await generateArticleImages(
          topic,
          articleData,
          (step: number, stepName: string) => {
            setGenerationStatus("loading");
            setCurrentStep(step.toString());
            setCurrentStepName(stepName);
          },
        );

        setGenerationStatus("success");
        setCurrentStep("3");
        setCurrentStepName("Завершено");

        const updated = await updateArticleWithImages(
          articleId,
          articleData,
          images,
          topic,
        );

        if (updated) {
          // Перенаправляем после успешной генерации
          setTimeout(() => {
            window.location.href = `/blog/${articleData.categorySlug}/${articleData.slug}`;
          }, 2000);
        } else {
          console.warn(
            "Статья создана, но обновление с изображениями не удалось",
          );
          setTimeout(() => {
            window.location.href = `/blog/${articleData.categorySlug}/${articleData.slug}`;
          }, 2000);
        }
      } catch (error) {
        console.error("Ошибка фоновой генерации изображений:", error);
        setGenerationStatus("error");
        setCurrentStepName("Ошибка");

        // В случае ошибки все равно перенаправляем
        setTimeout(() => {
          window.location.href = `/blog/${articleData.categorySlug}/${articleData.slug}`;
        }, 3000);
      }
    },
    [],
  );

  const handleGenerateAndSave = async () => {
    if (!topic.trim()) {
      setError("Введите тему статьи");
      return;
    }

    if (!categoryId) {
      setError("Выберите категорию");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setGenerationStatus("generating");
    setElapsedSeconds(0);

    try {
      const prompt = ARTICLE_GENERATION_PROMPT(topic);

      const response = await fetch(
        "/administrator/cms/api/articles/yandex-gpt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, action: "generate" }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.text) {
        throw new Error(
          data.error || data.details || "Ошибка генерации текста",
        );
      }

      const content = cleanGeneratedHtml(data.text);
      const slug = transliterate(topic, true);

      const stripHtmlTags = (html: string): string => {
        return html.replace(/<[^>]*>/g, "");
      };

      const plainText = stripHtmlTags(content);
      const description = plainText.substring(0, 160).trim();

      const articleData: ArticleFormData = {
        name: topic,
        slug,
        description,
        keywords: [],
        image: "",
        imageAlt: topic,
        author: author,
        categoryId: categoryId,
        categoryName: categoryName,
        categorySlug: categorySlug,
        content,
        isFeatured: false,
        status: "published",
      };

      const result = await createArticle(articleData);

      if (!result.success || !result.data?._id) {
        throw new Error(result.message || "Не удалось сохранить статью");
      }

      setSuccess(`Статья "${topic}" создана! Генерируем изображения...`);

      const articleId = result.data._id;

      const fullArticleData: ArticleData = {
        ...articleData,
        _id: articleId,
        content,
        categoryId,
        categoryName,
        categorySlug,
      };

      setTimeout(() => {
        generateImagesInBackground(articleId, topic, fullArticleData);
      }, 1000);
    } catch (err) {
      console.error("Ошибка генерации/сохранения:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      setIsGenerating(false);
      setGenerationStatus("error");
    }
  };

  const selectedCategory = categories.find((cat) => cat._id === categoryId);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Автогенерация статей
        </h1>
        <p className="text-gray-600 mt-2">
          Генерация и автоматическое сохранение статей с изображениями
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        {generationStatus !== "idle" ? (
          <GenerationStatusPanel
            status={generationStatus}
            elapsedSeconds={elapsedSeconds}
            currentStep={currentStep}
            totalSteps="3"
            currentStepName={currentStepName}
          />
        ) : (
          <ArticleForm
            topic={topic}
            selectedCategoryId={categoryId}
            selectedCategorySlug={selectedCategory?.slug}
            categorySlug={categorySlug}
            isCategoryOpen={isCategoryOpen}
            isGenerating={isGenerating}
            error={error}
            success={success}
            onTopicChange={setTopic}
            onCategorySelect={handleCategorySelect}
            onToggleCategoryOpen={() => setIsCategoryOpen(!isCategoryOpen)}
            onGenerate={handleGenerateAndSave}
          />
        )}

        <ProcessInfo />
      </div>
    </div>
  );
};

export default AutoGeneratePage;
