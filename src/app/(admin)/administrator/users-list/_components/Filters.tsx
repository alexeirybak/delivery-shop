"use client";

import { buttonStyles } from "@/app/styles";
import { FiltersState } from "@/types/filtersState";

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const Filters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: FiltersProps) => {
  const handleInputChange = (field: keyof FiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        <div className="flex gap-2">
          <button
            onClick={onApplyFilters}
            className={`${buttonStyles.active} [&&]:px-3 [&&]:text-xs`}
          >
            Найти
          </button>
          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-xs justify-center items-center active:shadow-button-active border-none rounded cursor-pointer  transition-custom bg-[#f3f2f1] hover:shadow-button-secondary"
          >
            Очистить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block mb-1 text-xs font-medium">ID</label>
          <input
            type="text"
            value={filters.id}
            onChange={(e) => handleInputChange("id", e.target.value)}
            placeholder="Поиск по ID"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Имя</label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Поиск по имени"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Фамилия</label>
          <input
            type="text"
            value={filters.surname}
            onChange={(e) => handleInputChange("surname", e.target.value)}
            placeholder="Поиск по фамилии"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Email</label>
          <input
            type="email"
            value={filters.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Поиск по email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Телефон</label>
          <input
            type="tel"
            value={filters.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Поиск по телефону"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Роль</label>
          <select
            value={filters.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="manager">Менеджер</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Возраст от</label>
          <input
            type="number"
            value={filters.minAge}
            onChange={(e) => handleInputChange("minAge", e.target.value)}
            min="0"
            placeholder="От"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">Возраст до</label>
          <input
            type="number"
            value={filters.maxAge}
            onChange={(e) => handleInputChange("maxAge", e.target.value)}
            min="0"
            placeholder="До"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">
            Регистрация от
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium">
            Регистрация до
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
