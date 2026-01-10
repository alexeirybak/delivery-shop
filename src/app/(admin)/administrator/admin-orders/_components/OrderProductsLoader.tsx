"use client";

import { useEffect, useState } from "react";
import ProductsSection from "@/components/ProductsSection";
import { ProductCardProps } from "@/types/product";
import MiniLoader from "@/components/MiniLoader";

interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderProductsLoaderProps {
  orderItems: OrderProduct[];
  applyIndexStyles?: boolean;
  showFullOrder?: boolean; 
  onTotalWeightCalculated?: (weight: number) => void;
}

const OrderProductsLoader = ({
  orderItems,
  applyIndexStyles = true,
  onTotalWeightCalculated,
}: OrderProductsLoaderProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = orderItems.map(async (item) => {
          const response = await fetch(`/api/products/${item.productId}`);
          const productData = await response.json();

          return {
            ...productData,
            orderQuantity: item.quantity,
          };
        });

        const productsData = await Promise.all(productPromises);
        setProducts(productsData);

        // Рассчитываем общую массу
        const weight = productsData.reduce((total, product, index) => {
          const itemWeight = product.weight || 0;
          const quantity = orderItems[index]?.quantity || 1;
          return total + itemWeight * quantity;
        }, 0);

        // Передаем массу родительскому компоненту
        if (onTotalWeightCalculated) {
          onTotalWeightCalculated(weight);
        }
      } catch (err) {
        console.error("Ошибка:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderItems && orderItems.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [orderItems, onTotalWeightCalculated]);

  if (loading) {
    return <MiniLoader />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-main-text">Товары не найдены</div>
      </div>
    );
  }

  return (
    <ProductsSection
      products={products}
      applyIndexStyles={applyIndexStyles}
      isAdminOrderPage={true}
    />
  );
};

export default OrderProductsLoader;