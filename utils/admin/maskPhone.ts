export const maskedValue = (value: string) => {
  if (!value) return "";

  const cleanPhone = value.replace(/\D/g, "");

  let formatted = "+7";

  if (cleanPhone.length > 1) {
    formatted += ` (${cleanPhone.slice(1, 4)}`;
  }

  if (cleanPhone.length > 4) {
    formatted += `) ${cleanPhone.slice(4, 7)}`;
  }

  if (cleanPhone.length > 7) {
    formatted += `-${cleanPhone.slice(7, 9)}`;
  }

  if (cleanPhone.length > 9) {
    formatted += `-${cleanPhone.slice(9, 11)}`;
  }

  return formatted;
};
