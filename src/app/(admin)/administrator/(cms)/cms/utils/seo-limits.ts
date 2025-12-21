export const SEO_LIMITS = {
  name: {
    min: 2,
    max: 60,
    message: "Название должно быть от 2 до 60 символов",
  },
  slug: {
    min: 2,
    max: 60,
    pattern: /^[a-z0-9-]+$/,
    message: "Slug должен содержать только латинские буквы, цифры и дефисы",
  },
  description: {
    min: 10,
    max: 160,
    message: "Описание должно быть от 10 до 160 символов (оптимально для SEO)",
  },
  keywords: {
    maxCount: 10,
    maxLength: 200,
    message: "Максимум 10 ключевых слов, общая длина не более 200 символов",
  },
};
