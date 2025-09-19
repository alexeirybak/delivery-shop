import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function updateProducts() {
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
      // Определяем производителя
      let manufacturer: string;
      if (product.isOurProduction === true) {
        manufacturer = 'Россия';
      } else {
        // Список производителей (без Украины)
        const manufacturers = ['Беларусь', 'Казахстан', 'Турция', 'Китай', 'Польша', 'Сербия', 'Армения', 'Азербайджан'];
        manufacturer = faker.helpers.arrayElement(manufacturers);
      }
      
      // Добавляем рандомный бренд
      const brands = [
        'Простоквашино', 'Беседа', 'Домик в деревне', 'ВкусВилл', 
        'Агрокомплекс', 'Green Ray', 'Фермерский продукт', 'Натуральный выбор',
        'Добрый', 'Чистый продукт', 'Бабушкина крынка', 'Савушкин продукт',
        'Моя семья', 'Лента', 'Магнит', 'Ашан', 'Перекресток'
      ];
      const brand = faker.helpers.arrayElement(brands);

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              manufacturer: manufacturer, // производитель
              brand: brand // бренд
            },
            $unset: { isOurProduction: "" }
          }
        }
      };
    });

    // 3. Выполняем массовое обновление
    if (bulkUpdateOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkUpdateOps);
      console.log(`Обновлено ${result.modifiedCount} продуктов`);
      console.log('Добавлены поля: manufacturer, brand');
      console.log('Удалено поле: isOurProduction');
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

updateProducts();

//Команда для запуска: npx ts-node seed-products-add-field.ts