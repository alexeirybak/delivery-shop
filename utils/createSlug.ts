import { transliterate } from "./transliterate";

export function createSlug(text: string, id: number): string {
  const transliterated = transliterate(text, false);
  
  const slug = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') 
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/--+/g, '-') 
    .replace(/^-+|-+$/g, '')
    .substring(0, 100); 
  
  if (!slug) {
    return `${id}`;
  }
  
  return `${id}-${slug}`;
}