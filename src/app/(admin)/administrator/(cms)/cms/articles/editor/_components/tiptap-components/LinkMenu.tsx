import { useState, useEffect } from "react";
import { Link as LinkIcon, Unlink } from "lucide-react";
import { EditorProps } from "../../../types";
import { LinkModal } from "./LinkModal";

export const LinkMenu = ({ editor }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    url: "",
    text: "",
    openInNewTab: true,
    isEditing: false
  });
  const [isLinkActive, setIsLinkActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateLinkActive = () => {
      const active = editor.isActive("link");
      setIsLinkActive(active);
    };

    editor.on("selectionUpdate", updateLinkActive);
    editor.on("transaction", updateLinkActive);
    
    updateLinkActive();

    return () => {
      editor.off("selectionUpdate", updateLinkActive);
      editor.off("transaction", updateLinkActive);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && editor.view.dom.contains(target)) {
        event.preventDefault();
        event.stopPropagation();
        
        const pos = editor.view.posAtDOM(target, 0);
        if (pos >= 0) {
          editor.chain().focus().setTextSelection(pos).run();
        }
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener('click', handleClick);

    return () => {
      editorDom.removeEventListener('click', handleClick);
    };
  }, [editor]);

  const handleOpenModal = () => {
    if (!editor) return;

    if (editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setModalProps({
        url: attrs.href || "",
        text: editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        ) || "",
        openInNewTab: attrs.target === "_blank",
        isEditing: true
      });
    } else {
      setModalProps({
        url: "",
        text: editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        ) || "",
        openInNewTab: true,
        isEditing: false
      });
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleOpenModal}
          className={`
            p-2 rounded duration-300 cursor-pointer
            ${isLinkActive
              ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
              : "text-gray-700 hover:bg-gray-100"
            }
          `}
          title="Добавить ссылку (Ctrl+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleRemoveLink}
          disabled={!isLinkActive}
          className={`
            p-2 rounded duration-300
            ${isLinkActive
              ? "text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              : "opacity-40 cursor-not-allowed text-gray-400"
            }
          `}
          title="Удалить ссылку"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>

      <LinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editor={editor}
        initialUrl={modalProps.url}
        initialText={modalProps.text}
        initialOpenInNewTab={modalProps.openInNewTab}
        isEditing={modalProps.isEditing}
      />
    </>
  );
};