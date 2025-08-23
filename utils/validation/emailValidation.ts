export const validateEmail = (email: string): string | null => {
  if (!email) {
    return null; // Пустой email - это нормально для необязательного поля
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Введите корректный email адрес";
  }
  
  return null;
};