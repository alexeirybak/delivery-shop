export function createSlug(text: string, id: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[а-яё]/g, (match) => {
      const translit: {[key: string]: string} = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return translit[match] || match;
    })
    // Удаляем спецсимволы, оставляем только буквы, цифры, пробелы и дефисы
    .replace(/[^a-z0-9\s-]/g, '')
    // Заменяем пробелы на дефисы
    .replace(/\s+/g, '-')
    // Убираем двойные дефисы
    .replace(/--+/g, '-')
    // Убираем дефисы в начале и конце
    .replace(/^-+|-+$/g, '')
    // Обрезаем длину
    .substring(0, 100);

  return `${id}-${slug}`;
}
