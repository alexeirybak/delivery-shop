import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES-модулей
const __dirname = dirname(fileURLToPath(import.meta.url));

// Типы для структуры данных
type Rating = {
  rate: number;
  count: number;
};

type Product = {
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: Rating;
  categories: string[];
  weight: number;
  quantity: number;
  tags?: string[];
  isFood?: boolean;
};

// 1. Чтение файла
const inputPath = join(__dirname, 'productsDatabase.json');
const rawData = readFileSync(inputPath, 'utf-8');
const products: Product[] = JSON.parse(rawData);

// 2. Обработка данных
const processedProducts = products.map(product => {
  const updatedProduct = { ...product };
  updatedProduct.tags = [];
  
  // Обработка actions и new
  if (updatedProduct.categories.includes('actions')) {
    updatedProduct.tags.push('actions');
    updatedProduct.categories = updatedProduct.categories.filter(cat => cat !== 'actions');
  }
  
  if (updatedProduct.categories.includes('new')) {
    updatedProduct.tags.push('new');
    updatedProduct.categories = updatedProduct.categories.filter(cat => cat !== 'new');
  }
  
  return updatedProduct;
});

// 3. Сохранение обработанных данных
const outputPath = join(__dirname, 'productsDatabaseProcessed.json');
writeFileSync(outputPath, JSON.stringify(processedProducts, null, 2));

console.log('Обработка завершена. Результат сохранен в productsDatabaseProcessed.json');