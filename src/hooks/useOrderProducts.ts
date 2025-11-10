import { useState, useEffect } from "react";
import { Order, OrderItem } from "@/types/order";
import { ProductCardProps } from "@/types/product";

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

            const productData: ProductCardProps = await response.json();

            const availableQuantity = productData.quantity;
            const orderQuantity = item.quantity;
            const isLowStock = availableQuantity < orderQuantity;
            const insufficientStock = availableQuantity === 0;

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

            const productCardData = {
              _id: productData._id,
              id: productData.id,
              img: productData.img,
              title: productData.title,
              description: productData.description,
              basePrice: item.price,
              discountPercent: item.discountPercent || 0,
              orderQuantity: orderQuantity,
              rating: productData.rating,
              quantity: productData.quantity,
              isLowStock,
              insufficientStock,
              categories: productData.categories || [],
            } as ProductCardProps;

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
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [order]);

  return { orderProducts, loading, stockWarnings };
};
