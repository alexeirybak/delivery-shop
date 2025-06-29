"use client";
 
import { useRouter } from "next/navigation";
import { startTransition } from "react";
 
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
 
  const handleRetry = () => {
    startTransition(() => {
      reset(); // Сброс клиентского состояния
      router.refresh(); // Перезагрузка серверных данных
    });
  };
  return (
    <div className="m-4 p-4 bg-red-100 text-red-800 flex justify-center items-center rounded">
      <p>Ошибка: {error.message}</p>
      <button
        onClick={handleRetry}
        className="ml-2 px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
      >
        Попробовать снова
      </button>
    </div>
  );
}