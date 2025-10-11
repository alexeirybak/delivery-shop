"use client";

import { useState, useCallback } from "react";
import { DeleteConfirmationModal } from "./_components/DeleteConfirmModal";
import SearchProductResult from "./_components/SearchProductsResult";
import SearchHeader from "./_components/SearchHeader";
import SearchInput from "./_components/SearchInput";
import SearchStates from "./_components/SearchStates";
import { ProductCardProps } from "@/types/product";

interface DeleteModalState {
  isOpen: boolean;
  productId: number | null;
  productTitle: string;
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    productId: null,
    productTitle: "",
  });

  const fetchProducts = useCallback(async (searchQuery: string = "") => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search-products?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const result = await response.json();
        setProducts(result.products || []);
        setHasSearched(true);
      } else {
        setProducts([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim().length >= 3) {
      fetchProducts(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim().length >= 3) {
      handleSearch();
    }
  };

  const openDeleteModal = (productId: number, productTitle: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productTitle: "",
    });
  };

  const handleClearResults = () => {
    setSearchTerm("");
    setProducts([]);
    setHasSearched(false);
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal.productId) return;

    setDeletingId(deleteModal.productId);

    try {
      const response = await fetch("/api/delete-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteModal.productId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProducts((prev) =>
          prev.filter((product) => product.id !== deleteModal.productId)
        );
        alert("Товар успешно удален");
      } else {
        alert(
          "Ошибка удаления товара: " + (result.error || "Неизвестная ошибка")
        );
      }
    } catch (error) {
      alert("Ошибка при удалении товара");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        productTitle={deleteModal.productTitle}
        isDeleting={deletingId !== null}
      />

      <SearchHeader />

      <SearchInput
        searchTerm={searchTerm}
        loading={loading}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />

      <SearchStates
        hasSearched={hasSearched}
        loading={loading}
        searchTerm={searchTerm}
      />

      {hasSearched && !loading && (
        <SearchProductResult
          products={products}
          deletingId={deletingId}
          onClearResults={handleClearResults}
          onOpenDeleteModal={openDeleteModal}
        />
      )}
    </div>
  );
}
