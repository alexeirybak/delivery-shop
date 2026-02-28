export const formatAIResponse = (text: string): string => {
  let formattedText = text;

  formattedText = formattedText.replace(/^(\s*)\*\s+(.+)$/gm, "<li>$2</li>");

  formattedText = formattedText.replace(
    /(<li>.*<\/li>\n?)+/g,
    (match) => `<ul>${match}</ul>`,
  );

  formattedText = formattedText.replace(
    /^##\s+(.+?)[.,;:!?]*\s*$/gm,
    "<h2>$1</h2>",
  );

  formattedText = formattedText.replace(
    /^###\s+(.+?)[.,;:!?]*\s*$/gm,
    "<h3>$1</h3>",
  );

  formattedText = formattedText.replace(
    /(^|\n)\s*\*\*\s*(.+?)[.,;:!?]*\s*\*\*\s*$/gm,
    "$1<h4>$2</h4>",
  );

  formattedText = formattedText.replace(
    /([^\n])\*\*\s*([^*]+?)\s*\*\*/g,
    "$1<strong>$2</strong>",
  );

  formattedText = formattedText.replace(
    /([^\n\*])\*([^*]+?)\*/g,
    "$1<em>$2</em>",
  );

  formattedText = formattedText.replace(/^(\s*)\d+\.\s+(.+)$/gm, "<li>$2</li>");

  formattedText = formattedText.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    if (!match.includes("<ol>") && !match.includes("<ul>")) {
      return `<ol>${match}</ol>`;
    }
    return match;
  });

  const lines = formattedText.split("\n");
  const processedLines = lines.map((line) => {
    if (line.trim() === "") return "";
    if (line.startsWith("<") || line.startsWith("</")) return line;
    if (
      line.startsWith("<h") ||
      line.startsWith("<p>") ||
      line.startsWith("<li>") ||
      line.startsWith("<ul>") ||
      line.startsWith("<ol>")
    )
      return line;
    return `<p>${line.trim()}</p>`;
  });

  formattedText = processedLines.join("\n");

  return formattedText;
};
