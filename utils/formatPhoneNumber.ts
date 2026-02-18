export function formatPhoneNumber(phone: string): string {
  if (!phone) return "+7 (999) 123-45-67";

  if (phone.startsWith("7")) {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
  }

  return phone;
}
