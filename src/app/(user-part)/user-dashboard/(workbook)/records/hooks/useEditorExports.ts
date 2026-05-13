import { useState } from "react";
import { downloadAsWord } from "../../../utils/downloadAsWord";
import { getLocalDateTime } from "../../../utils/getLocalDateTime";
import { Editor } from "@tiptap/react";
import { downloadAsPDF } from "../../../utils/downloadAsPDF";

export const useEditorExports = () => {
  const [downloading, setDownloading] = useState<"word" | "pdf" | null>(null);

  const getEditorHTML = (editor: Editor): string => {
    if (!editor) return "";
    return editor.getHTML();
  };

  const downloadAsWordFile = (
    editor: Editor,
    categoryName: string,
    recordName: string,
  ) => {
    if (!editor) return;
    setDownloading("word");

    const content = getEditorHTML(editor);
    const date = getLocalDateTime();
    const filename = `${categoryName}_${recordName}_${date}`;

    downloadAsWord(content, filename);
    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadAsPDFFile = async (
    editor: Editor,
    categoryName: string,
    recordName: string,
  ) => {
    if (!editor) return;
    setDownloading("pdf");

    const content = getEditorHTML(editor);
    const date = getLocalDateTime();
    const filename = `${categoryName}_${recordName}_${date}`;

    await downloadAsPDF(content, filename);
    setTimeout(() => setDownloading(null), 1000);
  };

  return {
    downloading,
    downloadAsWordFile,
    downloadAsPDFFile,
  };
};
