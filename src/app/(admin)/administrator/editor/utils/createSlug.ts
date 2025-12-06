import { transliterate } from "./transliterate";

export const createSlug = (text: string): string => {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Удаляем все символы кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, "-") // Заменяем пробелы на дефисы
    .replace(/-+/g, "-") // Убираем повторяющиеся дефисы
    .replace(/^-+/, "") // Убираем дефисы в начале
    .replace(/-+$/, ""); // Убираем дефисы в конце
};
