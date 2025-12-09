import { transliterate } from "./transliterate";

export function createSlug(text: string, id: number): string {
  // Транслитерируем без преобразования в slug
  const transliterated = transliterate(text, false);

  // Создаем slug с контролем качества
  const slug = transliterated
    .toLowerCase()
    // Более строгая фильтрация символов
    .replace(/[^a-z0-9\s-]/g, "") // Удаляем всё, кроме букв, цифр, пробелов и дефисов
    .trim() // Убираем пробелы по краям
    .replace(/\s+/g, "-") // Пробелы в дефисы
    .replace(/--+/g, "-") // Убираем двойные дефисы
    .replace(/^-+|-+$/g, "") // Убираем дефисы по краям
    .substring(0, 80); // Более короткий лимит для лучшего вида

  // Если slug пустой после обработки, используем просто ID
  if (!slug) {
    return `${id}`;
  }

  return `${id}-${slug}`;
}
