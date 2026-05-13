import { useState, useEffect } from "react";
import { Link as LinkIcon, Unlink } from "lucide-react";
import { LinkModal } from "./LinkModal";
import { EditorProps } from "../../types";
import "../../styles/link-menu.css";

export const LinkMenu = ({ editor }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    url: "",
    text: "",
    openInNewTab: true,
    isEditing: false,
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
      if (target.tagName === "A" && editor.view.dom.contains(target)) {
        event.preventDefault();
        event.stopPropagation();

        const pos = editor.view.posAtDOM(target, 0);
        if (pos >= 0) {
          editor.chain().focus().setTextSelection(pos).run();
        }
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener("click", handleClick);

    return () => {
      editorDom.removeEventListener("click", handleClick);
    };
  }, [editor]);

  const handleOpenModal = () => {
    if (!editor) return;

    if (editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setModalProps({
        url: attrs.href || "",
        text:
          editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
          ) || "",
        openInNewTab: attrs.target === "_blank",
        isEditing: true,
      });
    } else {
      setModalProps({
        url: "",
        text:
          editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
          ) || "",
        openInNewTab: true,
        isEditing: false,
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
      <div className="link-menu">
        <button
          type="button"
          onClick={handleOpenModal}
          className={`link-button ${isLinkActive ? "active" : ""}`}
          title="Добавить ссылку (Ctrl+K)"
        >
          <LinkIcon />
        </button>

        <button
          type="button"
          onClick={handleRemoveLink}
          disabled={!isLinkActive}
          className="link-remove-button"
          title="Удалить ссылку"
        >
          <Unlink />
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