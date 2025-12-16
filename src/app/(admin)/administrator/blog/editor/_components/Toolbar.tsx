// import { RefObject } from "react";
// import { Editor } from "@tiptap/react";
// import {
//   Bold,
//   Italic,
//   Underline as UnderlineIcon,
//   Image as ImageIcon,
//   Link as LinkIcon,
//   X,
//   Loader2,
//   Heading1,
//   Heading2,
//   Heading3,
//   Heading4,
//   Heading5,
//   List,
//   ListOrdered,
//   Quote,
//   Code,
//   Strikethrough,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
// } from "lucide-react";
// import ToolbarButton from "./ToolbarButton";
// import ToolbarGroup from "./ToolbarGroup";

// interface ToolbarProps {
//   editor: Editor;
//   uploading: boolean;
//   fileInputRef: RefObject<HTMLInputElement | null>;
//   onImageUpload: (file: File) => void;
//   onAddLink: () => void;
//   onRemoveLink: () => void;
//   showLinkInput: boolean;
// }

// export default function Toolbar({
//   editor,
//   uploading,
//   fileInputRef,
//   onImageUpload,
//   onAddLink,
//   onRemoveLink,
// }: ToolbarProps) {
//   const formatText = (action: "bold" | "italic" | "underline" | "strike") => {
//     switch (action) {
//       case "bold":
//         editor.chain().focus().toggleBold().run();
//         break;
//       case "italic":
//         editor.chain().focus().toggleItalic().run();
//         break;
//       case "underline":
//         editor.chain().focus().toggleUnderline().run();
//         break;
//       case "strike":
//         editor.chain().focus().toggleStrike().run();
//         break;
//     }
//   };

//   return (
//     <div className="border-b bg-gray-50 p-3 flex flex-wrap gap-2 items-center">
//       {/* Группа заголовков */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           isActive={editor.isActive("heading", { level: 1 })}
//           title="Заголовок 1"
//         >
//           <Heading1 className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           isActive={editor.isActive("heading", { level: 2 })}
//           title="Заголовок 2"
//         >
//           <Heading2 className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run()
//           }
//           isActive={editor.isActive("heading", { level: 3 })}
//           title="Заголовок 3"
//         >
//           <Heading3 className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 4 }).run()
//           }
//           isActive={editor.isActive("heading", { level: 4 })}
//           title="Заголовок 4"
//         >
//           <Heading4 className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 5 }).run()
//           }
//           isActive={editor.isActive("heading", { level: 5 })}
//           title="Заголовок 5"
//         >
//           <Heading5 className="w-4 h-4" />
//         </ToolbarButton>
//       </ToolbarGroup>

//       {/* Группа форматирования текста */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={() => formatText("bold")}
//           isActive={editor.isActive("bold")}
//           title="Жирный (Ctrl+B)"
//         >
//           <Bold className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => formatText("italic")}
//           isActive={editor.isActive("italic")}
//           title="Курсив (Ctrl+I)"
//         >
//           <Italic className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => formatText("underline")}
//           isActive={editor.isActive("underline")}
//           title="Подчеркивание (Ctrl+U)"
//         >
//           <UnderlineIcon className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => formatText("strike")}
//           isActive={editor.isActive("strike")}
//           title="Зачеркивание"
//         >
//           <Strikethrough className="w-4 h-4" />
//         </ToolbarButton>
//       </ToolbarGroup>

//       {/* Группа выравнивания */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           isActive={editor.isActive({ textAlign: "left" })}
//           title="Выравнивание по левому краю"
//         >
//           <AlignLeft className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           isActive={editor.isActive({ textAlign: "center" })}
//           title="Выравнивание по центру"
//         >
//           <AlignCenter className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           isActive={editor.isActive({ textAlign: "right" })}
//           title="Выравнивание по правому краю"
//         >
//           <AlignRight className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("justify").run()}
//           isActive={editor.isActive({ textAlign: "justify" })}
//           title="Выравнивание по ширине"
//         >
//           <AlignJustify className="w-4 h-4" />
//         </ToolbarButton>
//       </ToolbarGroup>

//       {/* Группа списков */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           isActive={editor.isActive("bulletList")}
//           title="Маркированный список"
//         >
//           <List className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           isActive={editor.isActive("orderedList")}
//           title="Нумерованный список"
//         >
//           <ListOrdered className="w-4 h-4" />
//         </ToolbarButton>
//       </ToolbarGroup>

//       {/* Группа блоков */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           isActive={editor.isActive("blockquote")}
//           title="Цитата"
//         >
//           <Quote className="w-4 h-4" />
//         </ToolbarButton>
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           isActive={editor.isActive("codeBlock")}
//           title="Блок кода"
//         >
//           <Code className="w-4 h-4" />
//         </ToolbarButton>
//       </ToolbarGroup>

//       {/* Группа ссылок */}
//       <ToolbarGroup>
//         <ToolbarButton
//           onClick={onAddLink}
//           isActive={editor.isActive("link")}
//           title="Добавить ссылку (Ctrl+K)"
//           activeClassName="bg-green-100 text-primary shadow-inner"
//         >
//           <LinkIcon className="w-4 h-4" />
//         </ToolbarButton>
//         {editor.isActive("link") && (
//           <ToolbarButton
//             onClick={onRemoveLink}
//             className="p-2 rounded hover:bg-red-50 text-red-500 hover:text-red-600"
//             title="Удалить ссылку"
//           >
//             <X className="w-4 h-4" />
//           </ToolbarButton>
//         )}
//       </ToolbarGroup>

//       {/* Кнопка загрузки изображения */}
//       <div className="flex items-center gap-1">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) onImageUpload(file);
//             e.target.value = "";
//           }}
//           className="hidden"
//         />
//         <ToolbarButton
//           onClick={() => fileInputRef.current?.click()}
//           disabled={uploading}
//           className={`flex items-center gap-2 ${uploading ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}`}
//           title="Добавить изображение"
//         >
//           {uploading ? (
//             <Loader2 className="w-4 h-4 animate-spin" />
//           ) : (
//             <>
//               <ImageIcon className="w-4 h-4" />
//               <span className="text-sm hidden sm:inline">Изображение</span>
//             </>
//           )}
//         </ToolbarButton>
//       </div>
//     </div>
//   );
// }