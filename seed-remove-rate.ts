import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function removeRateField() {
  try {
    // Подключение к базе данных
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log('Соединение с MongoDB установлено');

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME!);
    const productsCollection = db.collection('products');

    // Удаляем поле rate из всех документов
    const result = await productsCollection.updateMany(
      {}, // Фильтр для всех документов
      {
        $unset: {
          'rating.rate': "" // Удаляем поле rate из объекта rating
        }
      }
    );

    console.log(`Удалено поле rate из ${result.modifiedCount} документов`);

    await client.close();
    console.log('Разорвано соединение с MongoDB');
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

removeRateField();

//Команда для запуска: npx tsc seed-remove-rate.ts // node seed-remove-rate.js