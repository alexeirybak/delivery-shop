export const cleanCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\D/g, "");
};

export const isValidCardNumber = (cardNumber: string): boolean => {
  const cleaned = cleanCardNumber(cardNumber);
  return /^\d{16}$/.test(cleaned);
};

export const formatCardNumber = (cardNumber: string, isEditing: boolean = false): string => {
  const cleanValue = cleanCardNumber(cardNumber);
  
  if (!cleanValue) return "";
  
  if (!isEditing) {
    if (cleanValue.length <= 4) return cleanValue;
    return `**** **** **** ${cleanValue.slice(-4)}`;
  }
  
  if (cleanValue.length <= 4) return cleanValue;
  if (cleanValue.length <= 8) return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
  if (cleanValue.length <= 12) return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8)}`;
  return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8, 12)} ${cleanValue.slice(12)}`;
};