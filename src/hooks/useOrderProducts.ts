import { useState, useEffect } from "react";
import { Order, OrderItem } from "@/types/order";
import { ProductCardProps, ProductRating } from "@/types/product";

interface FetchedProductData {
  _id: string;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent?: number;
  rating: ProductRating;
  quantity: number;
  categories: string[];
  updatedAt: string;
}

export const useOrderProducts = (order: Order) => {
  const [orderProducts, setOrderProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const warnings: string[] = [];
        const promises = order.items.map(async (item: OrderItem) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok) {
              throw new Error(`Товар ${item.productId} не найден`);
            }

            const productData: FetchedProductData = await response.json();

            // Проверяем количество на складе
            const availableQuantity = productData.quantity || 0;
            const orderQuantity = item.quantity;
            const isLowStock = availableQuantity < orderQuantity;
            const insufficientStock = availableQuantity === 0;

            // Добавляем предупреждение если товара недостаточно
            if (isLowStock) {
              if (insufficientStock) {
                warnings.push(
                  `Товар "${productData.title}" временно отсутствует на складе`
                );
              } else {
                warnings.push(
                  `Товара "${productData.title}" осталось ${availableQuantity} шт., а в заказе ${orderQuantity} шт.`
                );
              }
            }

            const productCardData: ProductCardProps = {
              _id: productData._id,
              id: productData.id,
              img: productData.img,
              title: productData.title,
              description: productData.description,
              basePrice: item.basePrice || item.price, // Базовая цена из заказа
              discountPercent: item.discountPercent || 0, // Скидка из заказа
              orderQuantity: orderQuantity,
              rating: productData.rating,
              quantity: productData.quantity, // Оставляем текущее количество для проверки стока
              isLowStock,
              insufficientStock,
              categories: productData.categories || [],
            };

            return productCardData;
          } catch (fetchError) {
            console.error(
              `Ошибка загрузки товара ${item.productId}:`,
              fetchError
            );
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validProducts = results.filter(
          (product): product is ProductCardProps => product !== null
        );

        setOrderProducts(validProducts);
        setStockWarnings(warnings);
      } catch (globalError) {
        console.error("Ошибка загрузки товаров:", globalError);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [order]);

  return { orderProducts, loading, stockWarnings };
};
