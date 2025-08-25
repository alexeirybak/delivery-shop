const cleanCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\D/g, '');
};

export const validateCardNumber = (cardNumber: string): string | null => {
  const cleanedCardNumber = cleanCardNumber(cardNumber);
  
  if (cleanedCardNumber && cleanedCardNumber.length !== 16) {
    return "Номер карты должен содержать 16 цифр";
  }
  return null;
};