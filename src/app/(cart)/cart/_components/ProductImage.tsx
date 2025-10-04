import { memo } from "react";
import Image from "next/image";

interface ProductImageProps {
  productId: string;
  title: string;
}

const ProductImage = memo(function ProductImage({
  productId,
  title
}: ProductImageProps) {
  return (
    <div className="flex-shrink-0 w-20 h-15 min-w-20 min-h-15 bg-gray-100 rounded flex items-center justify-center shadow-cart-item relative">
      <Image
        src={`/images/products/img-${productId}.jpeg`}
        alt={title}
        width={80}
        height={60}
        className="object-cover rounded w-full h-full flex-shrink-0"
      />
    </div>
  );
});

export default ProductImage;