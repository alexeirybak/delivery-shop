import { validateBirthDate } from "./validateBirthDate";

export function validateRegisterForm(formData: {
  phone: string;
  surname: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  birthdayDate: string;
  region: string;
  location: string;
  gender: string;
  card?: string;
  email?: string;
  hasCard?: boolean;
}): { isValid: boolean; errorMessage?: string } {
    
  // Проверка телефона
  if (!formData.phone || formData.phone.replace(/\D/g, "").length !== 11) {
    return {
      isValid: false,
      errorMessage: "Введите корректный номер телефона (11 цифр)",
    };
  }

  // Проверка фамилии
  if (
    !formData.surname ||
    !/^[а-яА-ЯёЁa-zA-Z-]{2,}$/.test(formData.surname.trim())
  ) {
    return {
      isValid: false,
      errorMessage: "Фамилия должна содержать минимум 2 буквы",
    };
  }

  // Проверка имени
  if (
    !formData.firstName ||
    !/^[а-яА-ЯёЁa-zA-Z-]{2,}$/.test(formData.firstName.trim())
  ) {
    return {
      isValid: false,
      errorMessage: "Имя должно содержать минимум 2 буквы",
    };
  }

  // Проверка пароля
  if (
    !formData.password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)
  ) {
    return {
      isValid: false,
      errorMessage:
        "Пароль должен содержать 6+ символов, включая заглавные, строчные буквы и цифры",
    };
  }

  // Проверка подтверждения пароля
  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Пароли не совпадают",
    };
  }

  // Проверка даты рождения
  const birthDateValidation = validateBirthDate(formData.birthdayDate);
  if (!birthDateValidation.isValid) {
    return {
      isValid: false,
      errorMessage: birthDateValidation.error || "Некорректная дата рождения",
    };
  }

  // Проверка региона
  if (!formData.region) {
    return {
      isValid: false,
      errorMessage: "Выберите регион",
    };
  }

  // Проверка города
  if (!formData.location) {
    return {
      isValid: false,
      errorMessage: "Выберите город",
    };
  }

  // Проверка пола
  if (!formData.gender) {
    return {
      isValid: false,
      errorMessage: "Укажите пол",
    };
  }

  // Проверка email (если указан)
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return {
      isValid: false,
      errorMessage: "Введите корректный email",
    };
  }

  // Проверка номера карты (если указан и не отмечено "нет карты")
  if (
    !formData.hasCard &&
    formData.card &&
    !/^\d{16}$/.test(formData.card.replace(/\s/g, ""))
  ) {
    return {
      isValid: false,
      errorMessage: "Номер карты должен содержать 16 цифр",
    };
  }

  return { isValid: true };
}
