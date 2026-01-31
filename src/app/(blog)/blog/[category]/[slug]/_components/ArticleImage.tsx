import Image from "next/image";
import { ArticleImageProps } from "../../../types";

const ArticleImage = ({
  image,
  imageAlt,
  articleName,
}: ArticleImageProps) => {
  
  if (!image) { 
    return null;
  }

  return (
    <div className="mb-6">
      <Image
        width={800}
        height={450}
        src={image}
        alt={imageAlt || articleName}
        className="w-full max-h-96 object-cover rounded"
        priority
      />
    </div>
  );
};

export default ArticleImage;
