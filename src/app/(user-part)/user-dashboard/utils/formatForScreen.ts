export const formatForScreen = (text: string): string => {
  let formatted = text;
  formatted = formatted.replace(/^#+\s+/gm, "");
  formatted = formatted.replace(/^[-*]{3,}$/gm, "");
  formatted = formatted.replace(/`(.*?)`/g, "$1");
  return formatted;
};
