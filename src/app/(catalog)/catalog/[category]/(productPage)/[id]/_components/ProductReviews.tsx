"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import ErrorComponent from "@/components/ErrorComponent";

interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
}

interface ProductReviewsProps {
  productId: string;
  refreshKey?: number;
}

const ProductReviews = ({ productId, refreshKey = 0 }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить отзывы");
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить отзывы",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, refreshKey]);

  if (loading) {
    return (
      <div>
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
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Отзывы</h2>

      {reviews.length === 0 ? (
        <p className="text-main-text">Пока нет отзывов. Будьте первым!</p>
      ) : (
        <div className="flex flex-col gap-y-10">
          {reviews.map((review) => {
            const userName = review.userName || "Неизвестный пользователь";
            return (
              <div key={review._id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-[47px] border border-[#f3f2f1] p-2.5 w-9 h-9 flex items-center justify-center">
                    <Image
                      src="/icons-products/icon-user.svg"
                      alt="Пользователь"
                      width={16}
                      height={16}
                    />
                  </div>
                  <span className="text-lg">{userName}</span>
                </div>

                <div className="flex flex-row items-center gap-x-4 mb-2">
                  <StarRating rating={review.rating} />
                  <span className="text-[#8f8f8f] text-xs">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <p className="text-main-text text-base">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
