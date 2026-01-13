"use client";

import { useState } from "react";

export default function TestPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationId, setOperationId] = useState("fbv35nebavcgu35h76mr");

  const testExistingImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      console.log("Testing operation:", operationId);

      const response = await fetch(
        `/api/yandex-image?operationId=${operationId}`
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        console.log("✅ Image URL received, length:", data.imageUrl.length);
      } else {
        setError(data.error || "No image URL in response");
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testNewImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/yandex-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Тестовое изображение: кот в шляпе",
          aspect_ratio: "1:1",
          style: "default",
        }),
      });

      const data = await response.json();
      console.log("New image response:", data);

      if (data.operationId) {
        setOperationId(data.operationId);
        alert(
          `Новая операция создана: ${data.operationId}\n\nНачните опрос через 30 секунд.`
        );
      } else {
        setError(data.error || "No operation ID");
      }
    } catch (err) {
      console.error("New image error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const openImage = () => {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Тест YandexART API</h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Информация:</h2>
        <p className="mb-2">
          Operation ID:{" "}
          <code className="bg-gray-200 px-2 py-1 rounded">{operationId}</code>
        </p>
        <p className="text-sm text-gray-600">
          Это тестовая операция, которая уже должна быть завершена.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={testExistingImage}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 duration-300 cursor-pointer"
        >
          {loading ? "Загрузка..." : "Проверить существующее изображение"}
        </button>

        <button
          onClick={testNewImage}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 duration-300 cursor-pointer"
        >
          Создать новое изображение
        </button>

        {imageUrl && (
          <button
            onClick={openImage}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Открыть в новой вкладке
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Результат:</h2>
          <div className="bg-white border rounded-xl p-4 shadow-lg">
            <img
              src={imageUrl}
              alt="Тестовое изображение"
              className="max-w-full h-auto max-h-[500px] mx-auto rounded-lg"
              onError={(e) => {
                console.error("Image load error");
                e.currentTarget.src =
                  "https://via.placeholder.com/1024x1024?text=Ошибка+загрузки";
              }}
              onLoad={() => console.log("✅ Image loaded successfully")}
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                URL длина: {imageUrl.length.toLocaleString()} символов
                <br />
                Начинается с: {imageUrl.substring(0, 50)}...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Отладка:</h3>
        <button
          onClick={() => {
            fetch(`/api/yandex-image?operationId=${operationId}`)
              .then((r) => r.json())
              .then((data) => console.log("Raw API response:", data))
              .catch((err) => console.error("Debug error:", err));
          }}
          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
        >
          Вывести ответ API в консоль
        </button>

        <button
          onClick={() => {
            if (imageUrl) {
              console.log("Current image URL:", imageUrl.substring(0, 100));
              const img = new Image();
              img.onload = () => console.log("✅ Image loads in background");
              img.onerror = (e) => console.error("❌ Image fails to load:", e);
              img.src = imageUrl;
            }
          }}
          className="ml-4 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          Проверить загрузку изображения
        </button>
      </div>
    </div>
  );
}
