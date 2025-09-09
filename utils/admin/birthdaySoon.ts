export const isBirthdaySoon = (birthdayDate: string): boolean => {
  try {
    const now = new Date();
    const birthday = new Date(birthdayDate);
    
    // Устанавливаем текущий год для обоих дат
    const currentYearBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );
    
    // Считаем разницу в днях (игнорируя год)
    const diffTime = currentYearBirthday.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Проверяем ближайшие 3 дня (0 - сегодня, 1-3 - следующие дни)
    return diffDays <= 3 && diffDays >= 0;
  } catch {
    return false;
  }
};