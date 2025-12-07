import { Check, X } from "lucide-react";

interface LinkInputProps {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  onAddLink: () => void;
  onClose: () => void;
}

export default function LinkInput({
  linkUrl,
  setLinkUrl,
  onAddLink,
  onClose,
}: LinkInputProps) {
  return (
    <div className="px-4 py-3 border-b bg-green-50 flex items-center gap-2">
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="https://example.com"
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAddLink();
          }
          if (e.key === "Escape") {
            onClose();
          }
        }}
        autoFocus
      />
      <button
        onClick={onAddLink}
        className="p-2 rounded bg-primary text-white hover:shadow-button-default cursor-pointer duration-300"
        title="Добавить ссылку"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onClose}
        className="p-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer duration-300"
        title="Отмена"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}