"use client";

import { useState, useEffect } from "react";
import { useCardsStore } from "@/store/useCardsStore";
import { ItemsPerPageSelector } from "../_components/ItemsPerPageSelector";
import { Pagination } from "../_components/Pagination";
import { AddCardForm } from "./_components/AddCardForm";
import { FilterBar } from "./_components/FilterBar";
import { CardTable } from "./_components/CardTable";
import { Card } from "./types/cards.types";

const CardsPage = () => {
  const {
    cards,
    totalPages,
    loading,
    currentPage,
    currentFilter,
    searchCardNumber,
    searchOwner,
    itemsPerPage,
    setCurrentFilter,
    setSearchCardNumber,
    setSearchOwner,
    setCurrentPage,
    setItemsPerPage,
    loadCards,
  } = useCardsStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Временные состояния для поиска (до применения)
  const [tempSearchCardNumber, setTempSearchCardNumber] =
    useState(searchCardNumber);
  const [tempSearchOwner, setTempSearchOwner] = useState(searchOwner);
  const [tempFilter, setTempFilter] = useState(currentFilter);

  // Загрузка карт при монтировании и изменении currentPage
  useEffect(() => {
    loadCards({
      filter: currentFilter,
      searchCardNumber,
      searchOwner,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [
    currentPage,
    currentFilter,
    searchCardNumber,
    searchOwner,
    itemsPerPage,
    loadCards,
  ]);

  const handleApplyFilters = () => {
    setCurrentFilter(tempFilter);
    setSearchCardNumber(tempSearchCardNumber);
    setSearchOwner(tempSearchOwner);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempFilter("all");
    setTempSearchCardNumber("");
    setTempSearchOwner("");
    setCurrentFilter("all");
    setSearchCardNumber("");
    setSearchOwner("");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleAddCard = async (cleanedCardNumber: string) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: cleanedCardNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при добавлении карты");
      }

      setSuccess(data.message);
      loadCards({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (card: Card) => {
    const action = card.isActive ? "deactivate" : "activate";
    const message = card.isActive
      ? "Деактивировать карту? Она станет недоступна для использования."
      : "Активировать карту? Она станет доступна для использования.";

    if (!confirm(message)) return;

    try {
      const response = await fetch(
        `/api/admin/cards?cardNumber=${card.cardNumber}&action=${action}`,
        { method: "PATCH" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при изменении статуса");
      }

      setSuccess(data.message);
      loadCards({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleDelete = async (card: Card) => {
    const warning = card.owner
      ? "Карта привязана к пользователю! Удалить всё равно? Это действие необратимо."
      : "Удалить карту из системы? Это действие необратимо.";

    if (!confirm(warning)) return;

    try {
      const response = await fetch(
        `/api/admin/cards?cardNumber=${card.cardNumber}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при удалении карты");
      }

      setSuccess("Карта удалена");
      loadCards({
        filter: currentFilter,
        searchCardNumber,
        searchOwner,
        page: currentPage,
        limit: itemsPerPage,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Управление картами лояльности</h1>

      <AddCardForm
        onSubmit={handleAddCard}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        onErrorChange={setError}
        onSuccessChange={setSuccess}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <FilterBar
          tempFilter={tempFilter}
          tempSearchCardNumber={tempSearchCardNumber}
          tempSearchOwner={tempSearchOwner}
          onTempFilterChange={setTempFilter}
          onTempSearchCardNumberChange={setTempSearchCardNumber}
          onTempSearchOwnerChange={setTempSearchOwner}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : cards.length === 0 ? (
          <p className="text-gray-500">Карты не найдены</p>
        ) : (
          <>
            <CardTable
              cards={cards}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
            {totalPages > 1 && <Pagination type="cards" />}
          </>
        )}
      </div>
    </div>
  );
};

export default CardsPage;
