"use client";

import { ErrorProps } from "@/types/errorProps";

export default function ErrorComponent({ error, userMessage }: ErrorProps) {
  console.error("Произошла ошибка:", error);

  return (
    <div className="m-4 p-4 bg-red-100 text-red-800 rounded text-center">
      <p>{userMessage || "Произошла ошибка. Пожалуйста, попробуйте позже."}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
      >
        Попробовать снова
      </button>
    </div>
  );
}
