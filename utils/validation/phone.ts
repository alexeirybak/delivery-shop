export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const isPhoneValid = (phone: string): boolean => {
  const normalized = normalizePhone(phone);
  return normalized.length === 11 && normalized.startsWith('7');
};