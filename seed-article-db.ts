import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function addArticleField() {
  try {
    // Подключение к базе данных
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log('Соединение с MongoDB установлено');

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME!);
    const productsCollection = db.collection('products');

    // 1. Получаем все существующие продукты
    const existingProducts = await productsCollection.find({}).toArray();
    console.log(`Найдено ${existingProducts.length} продуктов для изменения`);

    // 2. Подготавливаем операции обновления
    const bulkUpdateOps = existingProducts.map(product => {
      // Генерируем шестизначное число с ведущими нулями
      const articleNumber = faker.number.int({ min: 0, max: 999999 });
      const article = articleNumber.toString().padStart(6, '0');

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              article: article
            }
          }
        }
      };
    });

    // 3. Выполняем массовое обновление
    if (bulkUpdateOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkUpdateOps);
      console.log(`Обновлено ${result.modifiedCount} продуктов`);
      console.log('Добавлено поле article с шестизначными номерами');
    } else {
      console.log('Нет продуктов для обновления');
    }

    await client.close();
    console.log('Разорвано соединение с MongoDB');
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

addArticleField();

// Команды для запуска: npx tsc seed-article-db.ts // node seed-article-db.js
