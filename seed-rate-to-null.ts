import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function resetRateField() {
  try {
    const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
    await client.connect();
    console.log('Соединение с MongoDB установлено');

    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME!);
    const productsCollection = db.collection('products');

    const result = await productsCollection.updateMany(
      {},
      {
        $set: {
          'rating.rate': 0
        }
      }
    );

    console.log(`Обнулено поле rate в ${result.modifiedCount} документах`);

    await client.close();
    console.log('Разорвано соединение с MongoDB');
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

resetRateField();

//Команда для запуска: npx tsc seed-rate-to-null.ts // node seed-rate-to-null.js