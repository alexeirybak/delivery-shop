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
}

const OrderProductsLoader = ({ orderItems }: OrderProductsLoaderProps) => {
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
  }, [orderItems]);

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
      applyIndexStyles={false}
      isAdminOrderPage={true}
    />
  );
};

export default OrderProductsLoader;