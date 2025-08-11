"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const CloseButton = () => {
  const router = useRouter();

  const handleClose = () => {
    router.replace("/");
  };
  return (
    <button
      onClick={handleClose}
      className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8 absolute top-0 right-0"
      aria-label="Закрыть"
    >
      <Image
        src="/icons-products/icon-closer.svg"
        width={24}
        height={24}
        alt="Закрыть"
      />
    </button>
  );
};

export default CloseButton;
