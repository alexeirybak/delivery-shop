import ErrorComponent from "@/components/ErrorComponent";
import StarRating from "@/components/StarRating";
import ReviewsWrapper from "./_components/ReviewsWrapper";
import { ProductDescription } from "@/types/productDescription";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: PageProps) => {
  let product: ProductDescription | null = null;
  let productId = "";

  try {
    productId = (await params).id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    product = await response.json();
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось загрузить данные о продукте"
      />
    );
  }

  if (!product) {
    return (
      <ErrorComponent
        error={new Error("Продукт не найден")}
        userMessage="Продукт не найден"
      />
    );
  }

  const discountedPrice = product.discountPercent
    ? product.basePrice * (1 - product.discountPercent / 100)
    : product.basePrice;

  return (
    <div className="mx-auto text-main-text">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <div className="flex flex-row flex-wrap items-center gap-6 mb-4 md:mb-6">
        <div className="text-xs">арт. {product.article}</div>
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <StarRating rating={product.rating?.rate || 5} />
          <p className="text-sm text-gray-600">
            {product.rating?.count || 0} отзывов
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <Image
            src={product.img}
            alt={product.title}
            width={500}
            height={500}
            className="w-full h-auto rounded-lg object-cover"
            priority
          />
          {product.discountPercent && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">{product.description}</p>

          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-gray-700">
                  {product.rating.rate}
                </span>
              </div>
              <span className="text-gray-400">
                ({product.rating.count} отзывов)
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">
                {discountedPrice.toFixed(2)} ₽
              </span>
              {product.discountPercent && (
                <span className="text-lg text-gray-400 line-through">
                  {product.basePrice.toFixed(2)} ₽
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Вес: </span>
              <span className="font-medium">{product.weight} кг</span>
            </div>
            <div>
              <span className="text-gray-500">В наличии: </span>
              <span className="font-medium">{product.quantity} шт</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-gray-500">Категории: </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Теги: </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {product.isHealthyFood && (
              <div className="flex items-center text-green-600">
                <span>✓ Полезное питание</span>
              </div>
            )}
            {product.isOurProduction && (
              <div className="flex items-center text-blue-600">
                <span>✓ Наше производство</span>
              </div>
            )}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Добавить в корзину
          </button>
        </div>
      </div>

      <ReviewsWrapper productId={productId} />
    </div>
  );
};

export default ProductPage;