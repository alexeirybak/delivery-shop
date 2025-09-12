import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { CONFIG } from "../../../../../config/config";
import { getShortDecimalId } from "../../../../../utils/admin/shortDecimalId";
import { calculateAge } from "../../../../../utils/admin/calculateAge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(
      searchParams.get("limit") || CONFIG.DEFAULT_PAGE_SIZE.toString()
    );
    const page = parseInt(searchParams.get("page") || "1");
    const role = searchParams.get("role");
    const managerRegion = searchParams.get("managerRegion");
    const managerLocation = searchParams.get("managerLocation");
    const isManager = searchParams.get("isManager") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    // Получаем параметры фильтрации
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const surname = searchParams.get("surname");
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const db = await getDB();

    // Сначала получаем всех пользователей
    const allUsers = await db.collection("user").find({}).toArray();

    // Применяем фильтрацию в памяти
    let filteredUsers = allUsers;

    // ФИЛЬТРАЦИЯ ПО ID (decimalId)
    if (id && id.trim() !== "") {
      filteredUsers = filteredUsers.filter((user) => {
        const userDecimalId = getShortDecimalId(user._id.toString());
        return userDecimalId.includes(id);
      });
    }

    // ФИЛЬТРАЦИЯ ПО РОЛИ
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // ФИЛЬТРАЦИЯ ПО ИМЕНИ
    if (name && name.trim() !== "") {
      const regex = new RegExp(name, "i");
      filteredUsers = filteredUsers.filter(
        (user) => user.name && regex.test(user.name)
      );
    }

    // ФИЛЬТРАЦИЯ ПО ФАМИЛИИ
    if (surname && surname.trim() !== "") {
      const regex = new RegExp(surname, "i");
      filteredUsers = filteredUsers.filter(
        (user) => user.surname && regex.test(user.surname)
      );
    }

   // ФИЛЬТРАЦИЯ ПО EMAIL
if (email && email.trim() !== '') {
  const searchEmail = email.trim().toLowerCase();
  
  filteredUsers = filteredUsers.filter(user => {
    // Проверяем базовые условия
    if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
      return false;
    }
    
    // ИСКЛЮЧАЕМ технические email (как в UI)
    if (user.email.includes(CONFIG.TEMPORARY_EMAIL_DOMAIN)) {
      return false; // Не показываем технические email в результатах поиска
    }
    
    // Поиск по содержанию
    const userEmail = user.email.toLowerCase();
    return userEmail.includes(searchEmail);
  });
}
    // ФИЛЬТРАЦИЯ ПО ТЕЛЕФОНУ
    if (phoneNumber && phoneNumber.trim() !== "") {
      const regex = new RegExp(phoneNumber, "i");
      filteredUsers = filteredUsers.filter(
        (user) => user.phoneNumber && regex.test(user.phoneNumber)
      );
    }

    // ФИЛЬТРАЦИЯ ПО ВОЗРАСТУ
    if ((minAge && minAge.trim() !== "") || (maxAge && maxAge.trim() !== "")) {
      filteredUsers = filteredUsers.filter((user) => {
        if (!user.birthdayDate) return false;

        const age = calculateAge(user.birthdayDate);
        let passesFilter = true;

        if (minAge && minAge.trim() !== "") {
          passesFilter = passesFilter && age >= parseInt(minAge);
        }
        if (maxAge && maxAge.trim() !== "") {
          passesFilter = passesFilter && age <= parseInt(maxAge);
        }

        return passesFilter;
      });
    }

    // ФИЛЬТРАЦИЯ ПО ДАТЕ РЕГИСТРАЦИИ
    if (
      (startDate && startDate.trim() !== "") ||
      (endDate && endDate.trim() !== "")
    ) {
      filteredUsers = filteredUsers.filter((user) => {
        if (!user.createdAt) return false;

        const userDate = new Date(user.createdAt);
        let passesFilter = true;

        if (startDate && startDate.trim() !== "") {
          passesFilter = passesFilter && userDate >= new Date(startDate);
        }
        if (endDate && endDate.trim() !== "") {
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999); // До конца дня
          passesFilter = passesFilter && userDate <= endDateObj;
        }

        return passesFilter;
      });
    }

    // ФИЛЬТРАЦИЯ ДЛЯ МЕНЕДЖЕРА
    if (isManager && managerRegion && managerLocation) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.region === managerRegion && user.location === managerLocation
      );
    }

    // СОРТИРОВКА
    filteredUsers.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortBy === "createdAt") {
        return (
          direction *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      }

      if (a[sortBy] < b[sortBy]) return -1 * direction;
      if (a[sortBy] > b[sortBy]) return 1 * direction;
      return 0;
    });

    // ПАГИНАЦИЯ
    const totalCount = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalCount);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // ФОРМАТИРОВАНИЕ РЕЗУЛЬТАТА
    const formattedUsers = paginatedUsers.map((user) => ({
      id: user._id.toString(),
      decimalId: getShortDecimalId(user._id.toString()),
      name: user.name || "",
      surname: user.surname || "",
      age: calculateAge(user.birthdayDate),
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "user",
      birthdayDate: user.birthdayDate || "",
      region: user.region || "",
      location: user.location || "",
      gender: user.gender || "",
      card: user.card || "",
      hasCard: user.hasCard || false,
      createdAt: user.createdAt
        ? new Date(user.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: user.updatedAt
        ? new Date(user.updatedAt).toISOString()
        : new Date().toISOString(),
      emailVerified: user.emailVerified || false,
      phoneNumberVerified: user.phoneNumberVerified || false,
    }));

    return NextResponse.json({
      users: formattedUsers,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: endIndex < totalCount,
    });
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке пользователей" },
      { status: 500 }
    );
  }
}
