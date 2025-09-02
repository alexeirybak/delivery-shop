"use client";

import { ErrorProps } from "@/types/errorProps";

export default function ErrorComponent({ error, userMessage }: ErrorProps) {
  console.error("Произошла ошибка:", error);

  return (
    <div className="m-4 p-4 bg-[#ffc7c7] text-[#d80000] rounded text-center">
      <p>{userMessage || "Произошла ошибка. Пожалуйста, попробуйте позже."}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-[#d80000] text-white rounded cursor-pointer"
      >
        Попробовать снова
      </button>
    </div>
  );
}
