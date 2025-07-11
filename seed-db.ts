import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
 
async function seedDatabase() {
  try {
    // Подключение к базе данных
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log('Соединение с MongoDB');
 
    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME!);
    const productsCollection = db.collection('products');
 
    // 1. Получаем все существующие продукты
    const existingProducts = await productsCollection.find({}).toArray();
    console.log(`Найдено ${existingProducts.length} продуктов для изменения`);
 
    // 2. Подготавливаем операции обновления
    const bulkUpdateOps = existingProducts.map(product => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            isOurProduction: faker.datatype.boolean({ probability: 0.7 }),
            isHealthyFood: faker.datatype.boolean({ probability: 0.6 }),
            isNonGMO: faker.datatype.boolean({ probability: 0.8 })
          }
        }
      }
    }));
 
    // 3. Выполняем массовое обновление
    if (bulkUpdateOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkUpdateOps);
      console.log(`Обновлено ${result.modifiedCount} продуктов`);
    } else {
      console.log('Нет продуктов для обновления');
    }
 
    // 4. Закрываем соединение
    await client.close();
    console.log('Разорвано соединение с MongoDB');
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}
 
// Запускаем скрипт
seedDatabase();