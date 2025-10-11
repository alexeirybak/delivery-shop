"use client";

import { initialProductData } from "@/constants/addProductFormData";
import {
  AddProductFormData,
  ImageUploadResponse,
} from "@/types/addProductTypes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Title from "../../add-product/_components/Title";
import Article from "../../add-product/_components/Article";
import Description from "../../add-product/_components/Description";
import BasePrice from "../../add-product/_components/Baseprice";
import Discount from "../../add-product/_components/Discount";
import Quantity from "../../add-product/_components/Quantity";
import Weight from "../../add-product/_components/Weight";
import Brand from "../../add-product/_components/Brand";
import Manufacturer from "../../add-product/_components/Manufacturer";
import Categories from "../../add-product/_components/Categories";
import Tags from "../../add-product/_components/Tags";
import CheckboxGroup from "../../add-product/_components/CheckboxGroup";
import ImageUploadSection from "../../add-product/_components/ImageUploadSection";
import { ProductCardProps } from "@/types/product";


export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [formData, setFormData] =
    useState<AddProductFormData>(initialProductData);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Продукт не найден");
          } else {
            setError("Ошибка загрузки продукта");
          }
          setIsLoadingProduct(false);
          return;
        }

        const product: ProductCardProps = await response.json();

        setFormData({
          title: product.title || "",
          description: product.description || "",
          basePrice: product.basePrice?.toString() || "0",
          discountPercent: product.discountPercent?.toString() || "0",
          weight: product.weight?.toString() || "0",
          quantity: product.quantity?.toString() || "0",
          article: product.article || "",
          brand: product.brand || "",
          manufacturer: product.manufacturer || "",
          categories: product.categories || [],
          tags: product.tags || [],
          isHealthyFood: product.isHealthyFood || false,
          isNonGMO: product.isNonGMO || false,
        });

        setExistingImage(product.img || "");
      } catch (error) {
        setError("Ошибка загрузки продукта");
        console.error("Error fetching product:", error);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

const uploadImage = async (imageFile: File | null): Promise<boolean> => {
  if (!imageFile) return false;

  setUploading(true);

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("imageId", productId); 

  try {
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data: ImageUploadResponse = await response.json();
    return data.success;

  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);
    return false;
  } finally {
    setUploading(false);
  }
};

const hasActionsTag = formData.tags.includes("actions");

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
    if (image) {
      const uploadResult = await uploadImage(image);
      if (!uploadResult) {
        alert("Ошибка загрузки изображения");
        setLoading(false);
        return;
      }
    }

    const response = await fetch(`/api/update-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        id: parseInt(productId), 
        basePrice: Number(formData.basePrice),
        discountPercent: Number(formData.discountPercent),
        weight: Number(formData.weight),
        quantity: Number(formData.quantity),
        isHealthyFood: formData.isHealthyFood,
        isNonGMO: formData.isNonGMO,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("Товар успешно обновлен!");
      router.push("/administrator");
    } else {
      alert("Ошибка обновления товара: " + (result.error || "Неизвестная ошибка"));
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

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  if (isLoadingProduct) {
    return (
      <div className="container flex justify-center items-center px-4 py-8 mx-auto">
        <div className="text-lg">Загрузка данных товара...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex flex-col items-center px-4 py-8 mx-auto">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <Link
          href="/administrator"
          className="bg-primary text-white py-2 px-4 rounded"
        >
          Вернуться в панель управления
        </Link>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center px-4 py-8 text-main-text mx-auto">
      <h1 className="text-3xl font-bold mb-8">Редактировать товар</h1>

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
          existingImage={existingImage}
        />
        
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-primary hover:shadow-button-default active:shadow-button-active text-white py-3 px-4 rounded disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Обновление..." : "Обновить товар"}
          </button>
        
      </form>
    </div>
  );
}
