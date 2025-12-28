import { Plus } from "lucide-react";

export function HeaderActions({ onCreate }: HeaderActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300"
        >
          <Plus className="w-5 h-5" />
          Новая категория
        </button>
      </div>
    </div>
  );
}
