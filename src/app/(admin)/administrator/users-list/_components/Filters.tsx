"use client";

export interface FiltersState {
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

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
  onClearFilters: () => void;
}

const Filters = ({ filters, onFilterChange, onClearFilters }: FiltersProps) => {
  const handleInputChange = (field: keyof FiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        <button
          onClick={onClearFilters}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Очистить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ID */}
        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <input
            type="text"
            value={filters.id}
            onChange={(e) => handleInputChange("id", e.target.value)}
            placeholder="Поиск по ID"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Имя */}
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Поиск по имени"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Фамилия */}
        <div>
          <label className="block text-sm font-medium mb-1">Фамилия</label>
          <input
            type="text"
            value={filters.surname}
            onChange={(e) => handleInputChange("surname", e.target.value)}
            placeholder="Поиск по фамилии"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={filters.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Поиск по email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Телефон */}
        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            type="tel"
            value={filters.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Поиск по телефону"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Роль */}
        <div>
          <label className="block text-sm font-medium mb-1">Роль</label>
          <select
            value={filters.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="manager">Менеджер</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        {/* Возраст от */}
        <div>
          <label className="block text-sm font-medium mb-1">Возраст от</label>
          <input
            type="number"
            min="0"
            value={filters.minAge}
            onChange={(e) => handleInputChange("minAge", e.target.value)}
            placeholder="От"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Возраст до */}
        <div>
          <label className="block text-sm font-medium mb-1">Возраст до</label>
          <input
            type="number"
            min="0"
            value={filters.maxAge}
            onChange={(e) => handleInputChange("maxAge", e.target.value)}
            placeholder="До"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Дата регистрации от */}
        <div>
          <label className="block text-sm font-medium mb-1">Регистрация от</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Дата регистрации до */}
        <div>
          <label className="block text-sm font-medium mb-1">Регистрация до</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;