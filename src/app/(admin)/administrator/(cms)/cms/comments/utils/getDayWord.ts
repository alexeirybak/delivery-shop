export const getDayWord = (days: number) => {
  if (days % 10 === 1 && days % 100 !== 11) return "день";
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100))
    return "дня";
  return "дней";
};
