// app/products/[id]/_components/AddReviewForm.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface AddReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

const AddReviewForm = ({ productId, onReviewAdded }: AddReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !comment.trim()) {
      setError("Заполните все поля");
      return;
    }

    if (!user) {
      setError("Необходимо авторизоваться");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при отправке отзыва");
      }

      setComment("");
      setRating(0);
      onReviewAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка при отправке отзыва";
      setError(errorMessage);
      console.error("Ошибка отправки отзыва:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Оставить отзыв</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Оценка</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="cursor-pointer hover:scale-110 transition-transform text-2xl mr-1"
              >
                {star <= rating ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-500 mt-1">Выбрано: {rating} звезд</p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Ваш отзыв
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Поделитесь вашим мнением о товаре..."
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || rating === 0 || !comment.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Отправка..." : "Отправить отзыв"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;