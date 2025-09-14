"use client";

import { useCallback, useEffect, useState } from "react";
import NavAndInfo from "./_components/NavAndInfo";
import { UserData } from "@/types/userData";
import ErrorComponent from "@/components/ErrorComponent";
import { useAuthStore } from "@/store/authStore";
import { CONFIG } from "../../../../../config/config";
import UsersTable from "./_components/UsersTable";
import { Loader } from "@/components/Loader";
import Filters from "./_components/Filters";
import { FiltersState } from "@/types/filtersState";

const PAGE_SIZE_OPTIONS = [1, 5, 10, 20, 50, 100];

const initialFilters: FiltersState = {
  id: "",
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
  role: "",
  minAge: "",
  maxAge: "",
  startDate: "",
  endDate: "",
};

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [pageSize, setPageSize] = useState(CONFIG.DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FiltersState>(initialFilters);

  const { user: currentUser } = useAuthStore();
  const isManager = currentUser?.role === "manager";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const newDirection =
      sortBy === field && sortDirection === "desc" ? "asc" : "desc";
    setSortBy(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const loadUsers = useCallback(
    async (
      page: number,
      sortField: string,
      sortDir: "asc" | "desc",
      limit: number,
      filters: FiltersState
    ) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          isManager: isManager.toString(),
          sortBy: sortField,
          sortDirection: sortDir,
        });

        if (filters.id) queryParams.append("id", filters.id);
        if (filters.name) queryParams.append("name", filters.name);
        if (filters.surname) queryParams.append("surname", filters.surname);
        if (filters.email) queryParams.append("email", filters.email);
        if (filters.phoneNumber)
          queryParams.append("phoneNumber", filters.phoneNumber);
        if (filters.role) queryParams.append("role", filters.role);
        if (filters.minAge) queryParams.append("minAge", filters.minAge);
        if (filters.maxAge) queryParams.append("maxAge", filters.maxAge);
        if (filters.startDate)
          queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);

        if (isManager && currentUser) {
          queryParams.append("managerRegion", currentUser.region || "");
          queryParams.append("managerLocation", currentUser.location || "");
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
    [currentUser, isManager]
  );

  useEffect(() => {
    loadUsers(currentPage, sortBy, sortDirection, pageSize, appliedFilters);
  }, [loadUsers, currentPage, pageSize, sortBy, sortDirection, appliedFilters]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div className="p-3 lg:p-6">
      <NavAndInfo
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={handlePageSizeChange}
        totalUsers={totalUsers}
      />
      <Filters
        onClearFilters={handleClearFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        filters={filters}
      />
      <UsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
};

export default UsersList;
