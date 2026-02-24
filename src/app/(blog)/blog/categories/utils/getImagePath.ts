export function getImagePath(image: string): string {
  if (!image || image.trim() === "") {
    return "";
  }
 
  const filename = image.split('/').pop() || '';
  return `/api/uploads/blog-categories/${filename}`;
}