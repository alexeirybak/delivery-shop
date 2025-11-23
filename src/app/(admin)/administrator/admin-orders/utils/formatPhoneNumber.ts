export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `+7 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9)}`;
  } else if (cleaned.length === 10) {
    return `+7 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8)}`;
  }

  return `+${cleaned}`;
};
