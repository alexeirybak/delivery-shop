"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import IconStar from "@/components/svg/IconStar";

interface AddReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

const AddReviewForm = ({ productId, onReviewAdded }: AddReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); 
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);
  const { user } = useAuthStore();

  const isFormValid = rating > 0 && comment.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Необходимо авторизоваться");
      return;
    }

    if (!isFormValid) {
      setShowValidationError(true);
      return;
    }

    setSubmitting(true);
    setError("");
    setShowValidationError(false);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          userId: user.id,
          userName: user.name,
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
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при отправке отзыва";
      setError(errorMessage);
      console.error("Ошибка отправки отзыва:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-4.5 flex flex-row gap-x-4 items-center">
          <label className="text-lg font-bold">Ваша оценка</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setShowValidationError(false);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer hover:scale-110 transition-transform mr-1"
              >
                <IconStar 
                  size={24} 
                  fillPercentage={
                    hoverRating >= star ? 100 : 
                    rating >= star ? 100 : 0
                  } 
                />
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[544px] mb-5">
          <div className="mb-4">
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setShowValidationError(false);
              }}
              rows={4}
              className="w-full max-w-[544px] bg-white px-4 py-2 border border-[#bfbfbf] rounded focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Отзыв"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Сообщение о необходимости заполнить все поля */}
          {showValidationError && (
            <div className="text-[#d80000] text-sm p-2 bg-[#ffc7c7] rounded mb-2">
              Пожалуйста, поставьте оценку и напишите отзыв
            </div>
          )}

          {/* Сообщение об ошибке авторизации или сервера */}
          {error && (
            <div className="text-[#d80000] text-sm p-2 bg-[#ffc7c7] rounded mb-2">
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`${
            submitting
              ? "cursor-not-allowed bg-[#fcd5ba] text-[#ff6633]"
              : "text-base bg-[#ff6633] text-white hover:shadow-(--shadow-article)"
          } w-[188px] p-2 flex items-center justify-center rounded duration-300 cursor-pointer`}
        >
          {submitting ? "Отправка..." : "Отправить отзыв"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;