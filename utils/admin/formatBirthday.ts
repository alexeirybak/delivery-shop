export const formatBirthday = (birthdayDate: string): string => {
  const date = new Date(birthdayDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
};
