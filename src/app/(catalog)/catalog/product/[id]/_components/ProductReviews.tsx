// app/products/[id]/_components/ProductReviews.tsx
"use client";

import { useState, useEffect } from "react";
import StarRating from "@/components/StarRating";

interface Review {
  _id: string; // исправлено с id на _id
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  refreshKey?: number;
}

const ProductReviews = ({ productId, refreshKey = 0 }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить отзывы");
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки отзывов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshKey]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Отзывы</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Отзывы</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Отзывы ({reviews.length})
      </h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">Пока нет отзывов. Будьте первым!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 bg-white border rounded-lg"> {/* Исправлено на review._id */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{review.userName}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;