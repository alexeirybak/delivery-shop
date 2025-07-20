export const validateDate = (
  date: string
): { isValid: boolean; error?: string } => {
  // Проверка формата даты (дд.мм.гггг)
  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(date)) {
    return {
      isValid: false,
      error: "Неверный формат даты рождения. Используйте формат дд.мм.гггг",
    };
  }

  // Проверка валидности даты
  const [day, month, year] = date.split(".");
  const testDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(testDate.getTime())) {
    return { isValid: false, error: "Некорректная дата рождения" };
  }

  // Проверка возраста (минимум 14 лет)
  const today = new Date();
  const birthDate = new Date(`${year}-${month}-${day}`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age < 14) {
    return { isValid: false, error: "Вы должны быть старше 14 лет" };
  }

  return { isValid: true };
};
