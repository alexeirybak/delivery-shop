"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface ProductContextType {
  title: string | null;
  setTitle: (title: string) => void;
}

// Убираем undefined и задаем значения по умолчанию
const ProductContext = createContext<ProductContextType>({
  title: null,
  setTitle: () => {}, // Пустая функция по умолчанию
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);

  return (
    <ProductContext.Provider value={{ title, setTitle }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  // Теперь контекст всегда определен
  return useContext(ProductContext);
}