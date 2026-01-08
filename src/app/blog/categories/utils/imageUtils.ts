export function getImagePath(image: string): string {
  if (!image || image.trim() === "") {
    return "";
  }

  let imagePath = image;

  // Убираем начальный слэш если есть
  if (imagePath.startsWith("/")) {
    imagePath = imagePath.substring(1);
  }

  // Проверяем, что путь начинается с blogCategories
  if (!imagePath.startsWith("blogCategories/")) {
    imagePath = `blogCategories/${imagePath}`;
  }

  return `/${imagePath}`;
}
