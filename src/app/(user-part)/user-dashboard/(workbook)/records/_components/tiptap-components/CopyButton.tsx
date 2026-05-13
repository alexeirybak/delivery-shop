import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CopyButton = ({ htmlContent }: { htmlContent: string }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      className={`html-editor-copy-btn ${copied ? "copied" : "copy"}`}
    >
      {copied ? (
        <>
          <Check />
          Скопировано
        </>
      ) : (
        <>
          <Copy />
          Копировать
        </>
      )}
    </button>
  );
};
