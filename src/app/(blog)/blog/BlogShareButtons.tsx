"use client";

import { useState, useEffect } from "react";
import {
  TelegramShareButton,
  VKShareButton,
  WhatsappShareButton,
  TelegramIcon,
  VKIcon,
  WhatsappIcon,
} from "react-share";

const ShareButton = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      setUrl(window.location.href);
      setTitle(document.title);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-50 right-0 pr-1.5 z-50">
      <div className="flex flex-col gap-3">
        <TelegramShareButton
          url={url}
          title={title}
          className="hover:opacity-70 transition-opacity"
        >
          <TelegramIcon size={24} round />
        </TelegramShareButton>

        <VKShareButton
          url={url}
          title={title}
          className="hover:opacity-70 transition-opacity"
        >
          <VKIcon size={24} round />
        </VKShareButton>

        <WhatsappShareButton
          url={url}
          title={title}
          className="hover:opacity-70 transition-opacity"
        >
          <WhatsappIcon size={24} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareButton;
