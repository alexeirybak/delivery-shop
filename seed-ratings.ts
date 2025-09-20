import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function updateProductsDistribution() {
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
      // Все значения оценок установлены в 0 внутри rating.distribution
      const distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
      };

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              'rating.rate': 5.0,    // Устанавливаем рейтинг 5.0
              'rating.count': 0,     // Обнуляем количество оценок
              'rating.distribution': distribution // Обнуляем распределение
            }
          }
        }
      };
    });

    // 3. Выполняем массовое обновление
    if (bulkUpdateOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkUpdateOps);
      console.log(`Обновлено ${result.modifiedCount} продуктов`);
      console.log('Обновлены значения rating:');
      console.log('rate: 5.0, count: 0');
      console.log('distribution: 1:0, 2:0, 3:0, 4:0, 5:0');
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

updateProductsDistribution();

//Команда для запуска: npx tsc seed-ratings.ts // node seed-ratings.js