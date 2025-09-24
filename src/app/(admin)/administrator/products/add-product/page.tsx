"use client";

import { useState, FormEvent, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import ImageUploadSection from "./_components/ImageUploadSection";
import Title from "./_components/Title";
import Article from "./_components/Article";
import Description from "./_components/Description";
import BasePrice from "./_components/BasePrice";
import Discount from "./_components/Discount";
import Quantity from "./_components/Quantity";
import Weight from "./_components/Weight";
import Brand from "./_components/Brand";
import Manufacturer from "./_components/Manufacturer";
import Categories from "./_components/Categories";
import Tags from "./_components/Tags";
import CheckboxGroup from "./_components/CheckboxGroup";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddProductApiResponse, AddProductFormData, ImageUploadResponse } from "@/types/addProductTypes";
import { initialProductData } from "@/constants/addProductFormData";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] =
    useState<AddProductFormData>(initialProductData);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  const hasActionsTag = formData.tags.includes("actions");

  const generateProductId = useCallback(() => {
    return Math.floor(Math.random() * 1000000000000000);
  }, []);

  const uploadImage = async (
    imageFile: File | null,
    id: number | null
  ): Promise<{ img: string; id: number } | null> => {
    if (!imageFile || !id) return null;

    setUploading(true);
    
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("imageId", id.toString());

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data: ImageUploadResponse = await response.json();

      if (data.success && data.product) {
        return { img: data.product.img, id: data.product.id };
      }
      return null;
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const clearForm = () => {
    setFormData(initialProductData);
    setImage(null);
    setCreatedProductId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      hasActionsTag &&
      (!formData.discountPercent || formData.discountPercent === "0")
    ) {
      alert("Для товара с тегом 'Акции' обязательно укажите размер скидки");
      return;
    }

    setLoading(true);

    try {
      const productId = generateProductId();
      let imagePath: string | null = null;

      if (image) {
        const uploadResult = await uploadImage(image, productId);
        if (uploadResult) {
          imagePath = uploadResult.img;
        } else {
          alert("Ошибка загрузки изображения");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          img: imagePath,
          id: productId,
          basePrice: Number(formData.basePrice),
          discountPercent: Number(formData.discountPercent),
          weight: Number(formData.weight),
          quantity: Number(formData.quantity),
          isHealthyFood: formData.isHealthyFood,
          isNonGMO: formData.isNonGMO,
        }),
      });

      const result: AddProductApiResponse = await response.json();

      if (response.ok && result.success) {
        setCreatedProductId(productId); // Сохраняем тот же ID
        alert("Товар успешно добавлен!");
      }

    } catch (error) {
      alert(
        "Ошибка: " +
          (error instanceof Error ? error.message : "Неизвестная ошибка")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <Link
        href="/administrator"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        Назад в панель управления
      </Link>
      <h1 className="text-3xl font-bold mb-8">Добавить товар</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Title onChangeAction={handleInputChange} title={formData.title} />
          <Article
            onChangeAction={handleInputChange}
            article={formData.article}
          />
        </div>
        <Description
          onChangeAction={handleInputChange}
          description={formData.description}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BasePrice
            onChangeAction={handleInputChange}
            basePrice={formData.basePrice}
          />
          <Discount
            onChangeAction={handleInputChange}
            discount={formData.discountPercent}
            required={hasActionsTag}
          />
          <Quantity
            onChangeAction={handleInputChange}
            quantity={formData.quantity}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Weight onChangeAction={handleInputChange} weight={formData.weight} />
          <Brand onChangeAction={handleInputChange} brand={formData.brand} />
          <Manufacturer
            onChangeAction={handleInputChange}
            manufacturer={formData.manufacturer}
          />
        </div>
        <Categories
          selectedCategories={formData.categories}
          onCategoriesChange={(categories) =>
            setFormData((prev) => ({ ...prev, categories }))
          }
        />
        <Tags
          selectedTags={formData.tags}
          onTagsChange={handleTagsChange}
          hasActionsTag={hasActionsTag}
        />
        <CheckboxGroup
          items={[
            {
              name: "isHealthyFood",
              label: "Здоровая еда",
              checked: formData.isHealthyFood,
            },
            { name: "isNonGMO", label: "Без ГМО", checked: formData.isNonGMO },
          ]}
          onChange={handleInputChange}
        />

        <ImageUploadSection
          onImageChange={handleImageChange}
          uploading={uploading}
          loading={loading}
        />

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-primary hover:shadow-button-default active:shadow-button-active text-white py-3 px-4 rounded disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Добавление..." : "Добавить товар"}
        </button>
      </form>
      {createdProductId && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-2xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-800 font-medium">
                Товар успешно создан!
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/catalog/${formData.categories[0]}/${createdProductId}`
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm cursor-pointer"
              >
                Перейти к товару
              </button>
              <button
                onClick={clearForm}
                className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-500 text-sm"
              >
                Добавить еще
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
