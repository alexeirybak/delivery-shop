import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Создаем виртуальное окно для серверного рендеринга
const createDOMPurify = () => {
  const window = new JSDOM('').window;
  return DOMPurify(window);
};

const purify = createDOMPurify();

/**
 * Безопасно очищает HTML для отображения
 * @param html HTML строка из редактора
 * @returns Очищенный безопасный HTML
 */
export function sanitizeArticleHTML(html: string): string {
  if (!html) return '';
  
  return purify.sanitize(html, {
    // Разрешенные теги (все что поддерживает Tiptap)
    ALLOWED_TAGS: [
      'p', 'br',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'code',
      'blockquote', 'pre',
      'ul', 'ol', 'li',
      'a',
      'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div'
    ],
    
    // Разрешенные атрибуты
    ALLOWED_ATTR: [
      // Ссылки
      'href', 'target', 'rel', 'title',
      // Изображения
      'src', 'alt', 'title', 'width', 'height', 
      'class', 'style', // для Tiptap-изображений
      // Таблицы
      'colspan', 'rowspan', 'border', 'cellpadding', 'cellspacing',
      // Общие
      'class', 'style', 'id'
    ],
    
    // Запрещенные теги (опасные)
    FORBID_TAGS: [
      'script', 'iframe', 'object', 'embed', 
      'form', 'input', 'textarea', 'button', 'select',
      'meta', 'link', 'style', 'base'
    ],
    
    // Запрещенные атрибуты (события)
    FORBID_ATTR: [
      'onerror', 'onload', 'onclick', 'onmouseover', 
      'onmouseout', 'onfocus', 'onblur', 'onchange',
      'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress'
    ],
    
    // Дополнительные настройки
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    USE_PROFILES: { html: true }
  });
}

