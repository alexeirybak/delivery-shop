import { faker } from "@faker-js/faker/locale/ru";
import { MongoClient } from "mongodb";
import "dotenv/config";
 
// Подключение к вашей БД
const DB_URL = process.env.DELIVERY_SHOP_DB_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DELIVERY_SHOP_DB_NAME || "delivery-shop";
 
interface Product {
  title: string;
  description: string;
  categories: string[];
  isOurProduction?: boolean;
  isHealthyFood?: boolean;
  isNonGMO?: boolean;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  // добавьте другие необходимые поля
}
 
function generateRussianProductName() {
  const products = [
    "Сыр Гауда",
    "Хлеб Бородинский",
    "Молоко Деревенское",
    "Колбаса Докторская",
    "Яблоки Красные",
    "Груши Конференция",
    "Йогурт Фруктовый",
    "Творог Обезжиренный",
    "Сметана 20%",
    "Курица Охлажденная",
    // добавьте другие русские названия
  ];
  return faker.helpers.arrayElement(products);
}
 
function generateRussianProductDescription() {
  const descriptions = [
    "Свежий и вкусный продукт высшего качества",
    "Натуральный продукт без искусственных добавок",
    "Произведено в экологически чистом регионе",
    "Идеально подходит для здорового питания",
    "Сертифицированный органический продукт",
    "Сделано с любовью и заботой о вашем здоровье",
    "Традиционный рецепт, современные технологии",
    "Без консервантов и искусственных красителей",
    "Рекомендовано диетологами",
    "Отборные ингредиенты, превосходный вкус",
  ];
  return faker.helpers.arrayElement(descriptions);
}
 
async function seedDatabase() {
  const client = new MongoClient(DB_URL);
 
  try {
    await client.connect();
    console.log("Соединение с MongoDB установлено");
 
    const db = client.db(DB_NAME);
 
    // Создаем новую коллекцию (необязательно, создастся автоматически при вставке)
    await db.createCollection("other-products");
 
    const productsCollection = db.collection<Product>("other-products");
 
    // Очистка коллекции (если она уже существует)
    await productsCollection.deleteMany({});
    console.log("Коллекция other-products очищена");
 
    // Генерация тестовых данных
    const mockProducts: Product[] = Array.from({ length: 1000 }, () => ({
      title: generateRussianProductName(),
      description: generateRussianProductDescription(),
      categories: [
        faker.helpers.arrayElement(["meat", "bakery", "dairy", "vegetables"]),
      ],
      isOurProduction: faker.datatype.boolean({ probability: 0.7 }),
      isHealthyFood: faker.datatype.boolean({ probability: 0.6 }),
      isNonGMO: faker.datatype.boolean({ probability: 0.8 }),
      price: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      rating: {
        rate: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        count: faker.number.int({ min: 0, max: 500 }),
      },
      createdAt: new Date(), // Добавляем дату создания
    }));
 
    // Вставка данных (создаст коллекцию автоматически, если её нет)
    const result = await productsCollection.insertMany(mockProducts);
    console.log(
      `Добавлено ${result.insertedCount} товаров в коллекцию other-products`
    );
 
    // Создаем индекс для быстрого поиска (опционально)
    await productsCollection.createIndex({ categories: 1 });
    console.log("Создан индекс для поля categories");
  } catch (error) {
    console.error("Ошибка при заполнении базы:", error);
  } finally {
    await client.close();
    console.log("Соединение с MongoDB закрыто");
  }
}
 
seedDatabase();