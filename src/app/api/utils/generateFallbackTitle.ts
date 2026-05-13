export function generateFallbackTitle(message: string): string {
  let title = message.trim();
  title = title.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]+/gu,
    "",
  );
  title = title.replace(/^[?!.,:;()\[\]{}<>*#@!%^&*\-+=~`|\\/]+/, "");
  title = title.replace(/[?!.,:;()\[\]{}<>*#@!%^&*\-+=~`|\\/]+$/, "");

  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const maxLength = 40;
  if (title.length > maxLength) {
    const truncated = title.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > 0) {
      title = truncated.slice(0, lastSpace) + "...";
    } else {
      title = truncated + "...";
    }
  }
  return title || "Новый чат";
}
