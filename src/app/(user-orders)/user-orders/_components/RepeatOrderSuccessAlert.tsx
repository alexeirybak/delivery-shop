"use client";

export const RepeatOrderSuccessAlert: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-[#008c48] font-medium">
          Повторный заказ успешно создан!
        </p>
        <button
          onClick={handleRefresh}
          className="ml-4 bg-[#008c48] text-white px-4 py-2 rounded hover:bg-[#006c38] duration-300 font-medium cursor-pointer"
        >
          Обновить страницу
        </button>
      </div>
    </div>
  );
};
