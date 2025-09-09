"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { UserData } from "@/types/userData";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import NavAndInfo from "./_components/NavAndInfo";
import UsersTable from "./_components/UsersTable";
import { useAuthStore } from "@/store/authStore";

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [1, 5, 10, 20, 50, 100];

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  const { user: currentUser } = useAuthStore();
  const isManager = currentUser?.role === 'manager';

  // Загрузка пользователей с пагинацией
  const loadUsers = useCallback(
    async (page: number, sortField: string, sortDir: "asc" | "desc", limit: number) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy: sortField,
          sortDirection: sortDir,
          isManager: isManager.toString(),
        });

        // Добавляем параметры региона и города для менеджера
        if (isManager && currentUser) {
          queryParams.append('managerRegion', currentUser.region || '');
          queryParams.append('managerLocation', currentUser.location || '');
        }

        const response = await fetch(`/api/admin/users?${queryParams}`);

        if (!response.ok) {
          throw new Error("Ошибка загрузки пользователей");
        }

        const data = await response.json();

        if (data?.users) {
          setUsers(data.users);
          setTotalUsers(data.totalCount);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setError({
          error:
            error instanceof Error ? error : new Error("Неизвестная ошибка"),
          userMessage: "Не удалось загрузить список пользователей",
        });
      } finally {
        setLoading(false);
      }
    },
    [isManager, currentUser]
  );

  // Загрузка данных при изменении страницы, сортировки или количества пользователей на странице
  useEffect(() => {
    loadUsers(currentPage, sortBy, sortDirection, pageSize);
  }, [currentPage, sortBy, sortDirection, pageSize, loadUsers]);

  const handleSort = (field: string) => {
    const newDirection =
      sortBy === field && sortDirection === "desc" ? "asc" : "desc";
    setSortBy(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div className="p-3 lg:p-6">
      <NavAndInfo 
        totalUsers={totalUsers} 
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      <UsersTable
        users={users}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default memo(UsersList);