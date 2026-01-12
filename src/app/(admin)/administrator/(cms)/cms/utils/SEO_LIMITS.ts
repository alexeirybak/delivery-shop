export const SEO_LIMITS = {
  name: {
    min: 2,
    max: 60,
    message: "Название должно быть от 2 до 60 символов",
  },
  slug: {
    min: 2,
    max: 60,
    message: "Slug должен быть от 2 до 60 символов",
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
  imageAlt: {
    min: 2,
    max: 125,
    message: "Описание должно быть от 2 до 125 символов (оптимально для SEO)",
  },
  articleLength: {
    min: 500,
    max: 30000,
    message: "Статья должна быть от 500 до 30000 символов (оптимально для SEO)",
  },
};
