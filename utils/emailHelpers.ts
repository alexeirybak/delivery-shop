import { CONFIG } from "./../config/config";

export const isTemporaryEmail = (email: string): boolean => {
  return email.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
};

export const shouldShowEmailPrompt = (email: string): boolean => {
  return isTemporaryEmail(email);
};