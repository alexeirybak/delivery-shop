import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

interface EditorExtensionsProps {
  maxChars: number;
}

export const editorExtensions = ({
  maxChars,
}: EditorExtensionsProps) => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5],
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc pl-4",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal pl-4",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-gray-300 pl-4 italic",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "bg-gray-100 rounded p-3 font-mono text-sm",
      },
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "rounded max-w-full h-auto my-2",
    },
    inline: true,
    allowBase64: true,
  }),
  Underline,
  Strike,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class:
        "text-primary underline hover:shadow-button-default cursor-pointer",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
    defaultAlignment: "left",
  }),
  CharacterCount.configure({
    limit: maxChars,
  }),
];