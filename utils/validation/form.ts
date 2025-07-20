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
}) {
  const errors: Record<string, string> = {};

  // Проверка телефона
  if (!formData.phone || formData.phone.replace(/\D/g, "").length < 11) {
    errors.phone = "Введите корректный номер телефона";
  }

  // Проверка фамилии
  if (!formData.surname || formData.surname.trim().length < 2) {
    errors.surname = "Введите фамилию";
  }

  // Проверка имени
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.firstName = "Введите имя";
  }

  // Проверка пароля
  if (!formData.password || formData.password.length < 8) {
    errors.password = "Пароль должен содержать минимум 8 символов";
  }

  // Проверка подтверждения пароля
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Пароли не совпадают";
  }

  // Проверка даты рождения
  if (!formData.birthdayDate || formData.birthdayDate.length < 10) {
    errors.birthdayDate = "Введите полную дату рождения";
  } else {
    const [day, month, year] = formData.birthdayDate.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    const minDate = new Date(1900, 0, 1);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 14);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      errors.birthdayDate = "Некорректная дата";
    } else if (date < minDate) {
      errors.birthdayDate = "Дата не может быть раньше 1900 года";
    } else if (date > maxDate) {
      errors.birthdayDate = "Вам должно быть больше 14 лет";
    }
  }

  // Проверка региона
  if (!formData.region) {
    errors.region = "Выберите регион";
  }

  // Проверка города
  if (!formData.location) {
    errors.location = "Выберите город";
  }

  // Проверка пола
  if (!formData.gender) {
    errors.gender = "Укажите пол";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}