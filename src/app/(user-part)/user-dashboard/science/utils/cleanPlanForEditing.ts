export const cleanPlanForEditing = (text: string): string => {
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
};