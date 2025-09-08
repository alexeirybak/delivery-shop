"use client";

import {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
  memo,
} from "react";
import { UserData, ListUsersResponse } from "@/types/userData";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import NavAndInfo from "./_components/NavAndInfo";
import Filters from "./_components/Filters";
import UsersTable from "./_components/UsersTable";

const PAGE_SIZE = 10;

interface FiltersState {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  role: string;
  minAge: string;
  maxAge: string;
  startDate: string;
  endDate: string;
}

const UsersList = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [filters, setFilters] = useState<FiltersState>({
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
  });

  const deferredFilters = useDeferredValue(filters);

  const calculateAge = useCallback((birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, []);

  // Загрузка всех пользователей
  const loadAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users?limit=1000`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ошибка загрузки пользователей");
      }

      const data: ListUsersResponse = await response.json();

      if (data?.users) {
        setAllUsers(data.users);
        setFilteredUsers(data.users);
        setTotalUsers(data.users.length);
      }
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить список пользователей",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Фильтрация и сортировка данных
  useEffect(() => {
    let result = [...allUsers];

    // Фильтрация по ID (последние 4 символа)
    if (deferredFilters.id) {
    const filterDigits = deferredFilters.id.replace(/\D/g, "");
    if (filterDigits) {
      result = result.filter((user) => {
        try {
          const last4Hex = user.id.slice(-4);
          const decimalId = parseInt(last4Hex, 16);
          const decimalString = decimalId.toString();
          return decimalString.includes(filterDigits);
        } catch {
          return false;
        }
      });
    }
  }

    if (deferredFilters.name) {
      result = result.filter((user) =>
        user.name?.toLowerCase().includes(deferredFilters.name.toLowerCase())
      );
    }

    if (deferredFilters.surname) {
      result = result.filter((user) =>
        user.surname
          ?.toLowerCase()
          .includes(deferredFilters.surname.toLowerCase())
      );
    }

    if (deferredFilters.email) {
      result = result.filter((user) =>
        user.email?.toLowerCase().includes(deferredFilters.email.toLowerCase())
      );
    }

    if (deferredFilters.phoneNumber) {
      result = result.filter((user) =>
        user.phoneNumber
          ?.toLowerCase()
          .includes(deferredFilters.phoneNumber.toLowerCase())
      );
    }

    if (deferredFilters.role) {
      result = result.filter((user) => user.role === deferredFilters.role);
    }

    if (deferredFilters.startDate) {
      const startDate = new Date(deferredFilters.startDate);
      result = result.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= startDate;
      });
    }

    if (deferredFilters.endDate) {
      const endDate = new Date(deferredFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate <= endDate;
      });
    }

    if (deferredFilters.minAge || deferredFilters.maxAge) {
      result = result.filter((user) => {
        if (!user.birthdayDate) return false;
        const birthDate = new Date(user.birthdayDate);
        const age = calculateAge(birthDate);

        if (deferredFilters.minAge && age < parseInt(deferredFilters.minAge))
          return false;
        if (deferredFilters.maxAge && age > parseInt(deferredFilters.maxAge))
          return false;
        return true;
      });
    }

    // Сортировка
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortBy === "age") {
        aValue = a.birthdayDate ? calculateAge(new Date(a.birthdayDate)) : 0;
        bValue = b.birthdayDate ? calculateAge(new Date(b.birthdayDate)) : 0;
      } else {
        const sortKey = sortBy as keyof UserData;
        aValue = a[sortKey] as string;
        bValue = b[sortKey] as string;
      }

      const aString = String(aValue || "");
      const bString = String(bValue || "");

      return sortDirection === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

    setFilteredUsers(result);
    setTotalUsers(result.length);
    setCurrentPage(1);
  }, [allUsers, deferredFilters, sortBy, sortDirection, calculateAge]);

  // Пагинация
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedUsers = filteredUsers.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
    setDisplayedUsers(paginatedUsers);
  }, [filteredUsers, currentPage]);

  // Первоначальная загрузка
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
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
    });
  };

  const handleRoleChange = useCallback(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div className="p-3 lg:p-6">
      <NavAndInfo totalUsers={totalUsers} />

      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <UsersTable
        users={displayedUsers}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default memo(UsersList);