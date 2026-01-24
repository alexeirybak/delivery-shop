export const formatAIResponse = (text: string): string => {
  let formattedText = text;
  
  // 1. Сначала обрабатываем списки, чтобы * в начале строк не мешали
  // Преобразуем * пункт списка в <li>
  formattedText = formattedText.replace(
    /^(\s*)\*\s+(.+)$/gm,
    '<li>$2</li>'
  );
  
  // 2. Группируем последовательные li в ul
  formattedText = formattedText.replace(
    /(<li>.*<\/li>\n?)+/g,
    (match) => `<ul>${match}</ul>`
  );
  
  // 3. Обработка заголовков уровня 2 (## Заголовок.)
  formattedText = formattedText.replace(
    /^##\s+(.+?)[.,;:!?]*\s*$/gm, 
    '<h2>$1</h2>'
  );
  
  // 4. Обработка заголовков уровня 3 (### Заголовок.)
  formattedText = formattedText.replace(
    /^###\s+(.+?)[.,;:!?]*\s*$/gm, 
    '<h3>$1</h3>'
  );
  
  // 5. Обработка заголовков уровня 4 (**Заголовок.**)
  formattedText = formattedText.replace(
    /(^|\n)\s*\*\*\s*(.+?)[.,;:!?]*\s*\*\*\s*$/gm, 
    '$1<h4>$2</h4>'
  );
  
  // 6. Обработка жирного текста (не заголовки)
  // Ищем **текст** но не в начале строки
  formattedText = formattedText.replace(
    /([^\n])\*\*\s*([^*]+?)\s*\*\*/g, 
    '$1<strong>$2</strong>'
  );
  
  // 7. Обработка курсива - захватываем текст между *...*
  // Исключаем случай, когда * в начале строки (это уже список)
  formattedText = formattedText.replace(
    /([^\n\*])\*([^*]+?)\*/g, 
    '$1<em>$2</em>'
  );
  
  // 8. Обработка нумерованных списков
  formattedText = formattedText.replace(
    /^(\s*)\d+\.\s+(.+)$/gm,
    '<li>$2</li>'
  );
  
  // 9. Группируем нумерованные списки
  formattedText = formattedText.replace(
    /(<li>.*<\/li>\n?)+/g,
    (match) => {
      // Проверяем, не сгруппирован ли уже список
      if (!match.includes('<ol>') && !match.includes('<ul>')) {
        return `<ol>${match}</ol>`;
      }
      return match;
    }
  );
  
  // 10. Добавляем параграфы для текста без разметки
  const lines = formattedText.split('\n');
  const processedLines = lines.map(line => {
    if (line.trim() === '') return '';
    if (line.startsWith('<') || line.startsWith('</')) return line;
    if (line.startsWith('<h') || line.startsWith('<p>') || line.startsWith('<li>') || 
        line.startsWith('<ul>') || line.startsWith('<ol>')) return line;
    return `<p>${line.trim()}</p>`;
  });
  
  formattedText = processedLines.join('\n');
  
  return formattedText;
};