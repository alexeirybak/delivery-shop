import { Editor } from "@tiptap/react";

export const TextLevelMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return (
      <div className="flex gap-2 mb-2 border-b pb-2">
        <select 
          disabled 
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-100"
        >
          <option>Загрузка...</option>
        </select>
      </div>
    );
  }

  const getCurrentHeadingLevel = (): string => {
    if (editor.isActive("paragraph")) return "0";
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i as 1 | 2 | 3 | 4 | 5 | 6 })) 
        return i.toString();
    }
    return "0";
  };

  return (
    <div className="flex gap-2">
      <select
        value={getCurrentHeadingLevel()}
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else if (level >= 1 && level <= 6) {
            editor.chain().focus().toggleHeading({ 
              level: level as 1 | 2 | 3 | 4 | 5 | 6 
            }).run();
          }
        }}
        className="px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        style={{ minWidth: "150px" }}
      >
        <option value="0">Обычный текст</option>
        <option value="1">Заголовок 1</option>
        <option value="2">Заголовок 2</option>
        <option value="3">Заголовок 3</option>
        <option value="4">Заголовок 4</option>
        <option value="5">Заголовок 5</option>
        <option value="6">Заголовок 6</option>
      </select>
    </div>
  );
};