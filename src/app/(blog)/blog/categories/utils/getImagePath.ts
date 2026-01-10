export function getImagePath(image: string): string {
  if (!image || image.trim() === "") {
    return "";
  }

  let imagePath = image;

  if (imagePath.startsWith("/")) {
    imagePath = imagePath.substring(1);
  }

  if (!imagePath.startsWith("blogCategories/")) {
    imagePath = `blogCategories/${imagePath}`;
  }

  return `/${imagePath}`;
}
