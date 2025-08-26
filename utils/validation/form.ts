import { validateBirthDate } from "./validateBirthDate";

export function validateRegisterForm(formData: {
  phoneNumber: string;
  surname: string;
  name: string;
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
  if (
    !formData.phoneNumber ||
    formData.phoneNumber.replace(/\D/g, "").length !== 11
  ) {
    return {
      isValid: false,
      errorMessage: "Введите корректный номер телефона (11 цифр)",
    };
  }

  if (
    !formData.surname ||
    !/^[а-яА-ЯёЁa-zA-Z-]{2,}$/.test(formData.surname.trim())
  ) {
    return {
      isValid: false,
      errorMessage: "Фамилия должна содержать минимум 2 буквы",
    };
  }

  if (!formData.name || !/^[а-яА-ЯёЁa-zA-Z-]{2,}$/.test(formData.name.trim())) {
    return {
      isValid: false,
      errorMessage: "Имя должно содержать минимум 2 буквы",
    };
  }

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

  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Пароли не совпадают",
    };
  }

  const birthDateValidation = validateBirthDate(formData.birthdayDate);
  if (!birthDateValidation.isValid) {
    return {
      isValid: false,
      errorMessage: birthDateValidation.error || "Некорректная дата рождения",
    };
  }

  if (!formData.region) {
    return {
      isValid: false,
      errorMessage: "Выберите регион",
    };
  }

  if (!formData.location) {
    return {
      isValid: false,
      errorMessage: "Выберите город",
    };
  }

  if (!formData.gender) {
    return {
      isValid: false,
      errorMessage: "Укажите пол",
    };
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return {
      isValid: false,
      errorMessage: "Введите корректный email",
    };
  }

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
