import { Save } from "lucide-react";

const SubmitSection = () => {
  return (
    <>
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-primary/30"
        >
          <Save className="w-4 h-4" />
          Сохранить изменения
        </button>
        <button
          type="button"
          className="px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-gray-200"
        >
          Отмена
        </button>
      </div>
    </>
  );
};

export default SubmitSection;
