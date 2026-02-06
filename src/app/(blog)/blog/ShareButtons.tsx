"use client";

import { useState, useEffect } from "react";
import {
  TelegramShareButton,
  VKShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramIcon,
  VKIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

const ShareButtons = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
      setTitle(document.title);
      
      // Получаем изображение из OpenGraph метатегов
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        setImage(ogImage.getAttribute('content') || '');
      }
    }
  }, []);

  return (
    <div className="flex gap-2">
      {/* Telegram */}
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
      
      {/* VK - добавляем image если есть */}
      <VKShareButton url={url} title={title} image={image}>
        <VKIcon size={32} round />
      </VKShareButton>
      
      {/* WhatsApp */}
      <WhatsappShareButton url={url} title={title} separator=" :: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      
      {/* Email */}
      <EmailShareButton url={url} subject={title} body={`Посмотрите эту статью: ${url}`}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default ShareButtons;