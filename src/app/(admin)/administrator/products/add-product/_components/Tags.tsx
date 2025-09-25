import { AlertTriangle } from "lucide-react";

interface TagsProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  hasActionsTag: boolean;
}

const Tags = ({ selectedTags, onTagsChange, hasActionsTag }: TagsProps) => {
  const availableTags = [
    { value: "actions", label: "Акции" },
    { value: "new", label: "Новинки" },
  ];

  const handleTagChange = (tagValue: string, isChecked: boolean) => {
    const newTags = isChecked
      ? [...selectedTags, tagValue]
      : selectedTags.filter((tag) => tag !== tagValue);

    onTagsChange(newTags);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Теги</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTags.map((tag) => {
          const checked = selectedTags.includes(tag.value);
          return (
            <label
              key={tag.value}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleTagChange(tag.value, e.target.checked)}
                  className="absolute opacity-0 w-0 h-0"
                />
                <div
                  className={`relative w-5 h-5 border rounded flex items-center justify-center duration-300 ${
                    checked
                      ? "bg-primary border-primary"
                      : "bg-white border-[#bfbfbf]"
                  }`}
                >
                  {checked && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm">{tag.label}</span>
            </label>
          );
        })}
      </div>
      {hasActionsTag && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Для товара с тегом &quot;Акции&quot; обязательно укажите скидку
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;
