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
import Image from "next/image";

interface ShareButtonProps {
  title: string;
  className?: string;
}

const ShareButton = ({ title, className = "" }: ShareButtonProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-row flex-wrap gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setShowShareMenu(!showShareMenu);
        }}
      >
        <Image
          src="/icons-products/icon-share.svg"
          alt="Поделиться"
          width={24}
          height={24}
        />
        <p className="text-sm select-none">Поделиться</p>
      </div>

      {showShareMenu && currentUrl && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
          <div className="absolute top-full left-0 bg-white shadow-lg rounded-md p-3 z-50 mt-2 border border-gray-200">
            <div className="flex gap-3">
              <TelegramShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>

              <VKShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <VKIcon size={32} round />
              </VKShareButton>

              <WhatsappShareButton
                url={currentUrl}
                title={title}
                className="hover:opacity-70 transition-opacity"
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;