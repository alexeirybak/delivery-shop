export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "Молоко, сыр, яйцо": "dairy",
  "Хлеб": "bread",
  "Фрукты и овощи": "fruits",
  "Замороженные продукты": "frozen",
  "Напитки": "drinks",
  "Кондитерские изделия": "confectionery",
  "Чай, кофе": "tea-coffee",
  "Бакалея": "grocery",
  "Здоровое питание": "healthy",
  "Зоотовары": "zoo",
  "Детское питание": "kids",
  "Мясо, птица, колбаса": "meat",
  "Непродовольственные товары": "non-food"
};

export const REVERSE_CATEGORY_TRANSLATIONS: Record<string, string> = 
  Object.fromEntries(
    Object.entries(CATEGORY_TRANSLATIONS).map(([ru, en]) => [en, ru])
  );