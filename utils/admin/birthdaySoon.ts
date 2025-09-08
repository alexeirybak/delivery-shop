export const isBirthdaySoon = (birthdayDate: string): boolean => {
  try {
    const now = new Date();
    const birthday = new Date(birthdayDate);
    birthday.setFullYear(now.getFullYear());
    if (birthday < now) birthday.setFullYear(now.getFullYear() + 1);
    const diffTime = birthday.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  } catch {
    return false;
  }
};
