// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import { useState, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import Toolbar from "./Toolbar";
// import LinkInput from "./LinkInput";
// import CharacterCounter from "./CharacterCounter";
// import { useImageUpload } from "@/hooks/useImageUpload";
// import { editorExtensions } from "../../../../../../../utils/admin/editorExtensions";

// interface TipTapEditorProps {
//   content?: string;
//   onChange?: (content: string) => void;
//   maxChars?: number;
// }

// export default function TipTapEditor({
//   content = "",
//   onChange,
//   maxChars = 5000,
// }: TipTapEditorProps) {
//   const [isMounted, setIsMounted] = useState(false);
//   const [showLinkInput, setShowLinkInput] = useState(false);
//   const [linkUrl, setLinkUrl] = useState("");
//   const { uploading, fileInputRef, handleImageUpload } = useImageUpload();

//   console.log("TipTapEditor получил content:", content?.substring(0, 200));

//   const editor = useEditor({
//     extensions: editorExtensions({ maxChars }),
//     content: content,
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       onChange?.(html);
//     },
//     editorProps: {
//       attributes: {
//         class: "prose prose-sm max-w-none focus:outline-none min-h-[250px] p-2",
//       },
//       handleDrop: (view, event, slice, moved) => {
//         if (!moved && event.dataTransfer?.files?.length) {
//           event.preventDefault();
//           const file = event.dataTransfer.files[0];
//           if (file.type.startsWith("image/") && editor) {
//             handleImageUpload(file, editor);
//             return true;
//           }
//         }
//         return false;
//       },
//       handlePaste: (view, event) => {
//         const items = event.clipboardData?.items;
//         if (items && editor) {
//           for (const item of items) {
//             if (item.type.startsWith("image/")) {
//               event.preventDefault();
//               const file = item.getAsFile();
//               if (file) {
//                 handleImageUpload(file, editor);
//                 return true;
//               }
//             }
//           }
//         }
//         return false;
//       },
//     },
//     immediatelyRender: false,
//   });

//   // Критически важный useEffect для обновления контента
//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content);
//     }
//   }, [content, editor]);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return (
//       <div className="border rounded p-8 flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   if (!editor) {
//     return null;
//   }

//   const handleAddLink = () => {
//     if (!editor) return;

//     if (showLinkInput) {
//       if (linkUrl) {
//         editor.chain().focus().setLink({ href: linkUrl }).run();
//       }
//       setShowLinkInput(false);
//       setLinkUrl("");
//     } else {
//       const previousUrl = editor.getAttributes("link").href;
//       setLinkUrl(previousUrl || "");
//       setShowLinkInput(true);
//     }
//   };

//   const handleRemoveLink = () => {
//     if (!editor) return;
//     editor.chain().focus().unsetLink().run();
//     setShowLinkInput(false);
//   };

//   // Функция-обертка для безопасной загрузки изображений
//   const safeHandleImageUpload = (file: File) => {
//     if (!editor) return;
//     handleImageUpload(file, editor);
//   };

//   return (
//     <div className="border rounded overflow-hidden bg-white shadow-sm">
//       <Toolbar
//         editor={editor}
//         uploading={uploading}
//         fileInputRef={fileInputRef}
//         onImageUpload={safeHandleImageUpload}
//         onAddLink={handleAddLink}
//         onRemoveLink={handleRemoveLink}
//         showLinkInput={showLinkInput}
//       />

//       {showLinkInput && (
//         <LinkInput
//           linkUrl={linkUrl}
//           setLinkUrl={setLinkUrl}
//           onAddLink={handleAddLink}
//           onClose={() => {
//             setShowLinkInput(false);
//             setLinkUrl("");
//           }}
//         />
//       )}

//       <div className="min-h-[350px] max-h-[600px] overflow-y-auto">
//         <EditorContent editor={editor} className="min-h-[300px] p-4" />
//       </div>

//       <CharacterCounter editor={editor} maxChars={maxChars} />
//     </div>
//   );
// }
