import { Loader2, Save } from "lucide-react";

const SubmitSection = ({ isSubmitting, isUploading, editingId, onCancel }) => {
  return (
    <>
      {isSubmitting && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded text-sm border border-blue-100">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {editingId ? "Обновляем категорию" : "Создаем категорию..."}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-primary/30"
        >
          <Save className="w-4 h-4" />
          {isSubmitting
            ? "Сохранение..."
            : editingId
              ? "Сохранить изменения"
              : "Создать категорию"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading || isSubmitting}
          className="px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-gray-200"
        >
          Отмена
        </button>
      </div>
    </>
  );
};

export default SubmitSection;
