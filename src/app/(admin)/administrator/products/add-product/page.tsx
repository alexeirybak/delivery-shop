'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../_components/ImageUploader';

interface FormData {
  title: string;
  description: string;
  basePrice: string;
  discountPercent: string;
  weight: string;
  quantity: string;
  article: string;
  brand: string;
  manufacturer: string;
  isHealthyFood: boolean;
  isNonGMO: boolean;
  categories: string[];
  tags: string[];
}

interface ApiResponse {
  success: boolean;
  product?: {
    _id: string;
    id: number;
    img: string;
    title: string;
  };
  error?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    basePrice: '',
    discountPercent: '0',
    weight: '',
    quantity: '',
    article: '',
    brand: '',
    manufacturer: '',
    isHealthyFood: false,
    isNonGMO: false,
    categories: [],
    tags: []
  });
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleImageUpload = (file: File) => {
    setImage(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse = await response.json();
      
      if (data.success && data.product) {
        return data.product.img;
      }
      return null;
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath: string | null = null;
      
      if (image) {
        imagePath = await uploadImage();
        if (!imagePath) {
          alert('Ошибка загрузки изображения');
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          img: imagePath,
          basePrice: Number(formData.basePrice),
          discountPercent: Number(formData.discountPercent),
          weight: Number(formData.weight),
          quantity: Number(formData.quantity),
          isHealthyFood: formData.isHealthyFood,
          isNonGMO: formData.isNonGMO
        }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        alert('Товар успешно добавлен!');
        router.push('/admin/products');
      } else {
        alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Добавить товар</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Название товара *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Артикул *</label>
            <input
              type="text"
              name="article"
              required
              value={formData.article}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Описание *</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Базовая цена *</label>
            <input
              type="number"
              name="basePrice"
              step="0.01"
              required
              value={formData.basePrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Скидка (%)</label>
            <input
              type="number"
              name="discountPercent"
              step="1"
              value={formData.discountPercent}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Количество *</label>
            <input
              type="number"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Вес (кг) *</label>
            <input
              type="number"
              name="weight"
              step="0.01"
              required
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Бренд *</label>
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Производитель *</label>
            <input
              type="text"
              name="manufacturer"
              required
              value={formData.manufacturer}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Категории</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Добавить категорию"
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded flex items-center">
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Теги</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Добавить тег"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isHealthyFood"
              checked={formData.isHealthyFood}
              onChange={handleInputChange}
              className="mr-2"
            />
            Здоровая еда
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isNonGMO"
              checked={formData.isNonGMO}
              onChange={handleInputChange}
              className="mr-2"
            />
            Без ГМО
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Изображение товара *</label>
          <ImageUploader onImageUpload={handleImageUpload} />
          {image && (
            <p className="mt-2 text-sm text-green-600">
              Выбрано: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {uploading && <p className="mt-2 text-sm text-blue-600">Загрузка изображения...</p>}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-green-500 text-white py-3 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Добавление...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  );
}