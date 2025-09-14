import { MongoClient } from "mongodb";
import "dotenv/config";

const DB_URL = process.env.DELIVERY_SHOP_DB_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DELIVERY_SHOP_DB_NAME || "delivery-shop";

function generateSixDigitArticle() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function addArticlesBulk() {
  const client = new MongoClient(DB_URL);

  try {
    await client.connect();
    console.log("Соединение с MongoDB установлено");

    const db = client.db(DB_NAME);
    const productsCollection = db.collection("products");

    // Получаем все продукты без артикула
    const products = await productsCollection.find({ article: { $exists: false } }).toArray();
    console.log(`Найдено ${products.length} продуктов без артикула`);

    if (products.length === 0) {
      console.log("Все продукты уже имеют артикулы");
      return;
    }

    // Генерируем уникальные артикулы
    const usedArticles = new Set();
    const updates = [];

    for (const product of products) {
      let article;
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        article = generateSixDigitArticle();
        if (!usedArticles.has(article)) {
          usedArticles.add(article);
          break;
        }
        attempts++;
      }

      if (attempts === maxAttempts) {
        console.warn(`Не удалось сгенерировать уникальный артикул для продукта ${product._id}`);
        continue;
      }

      updates.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              article: article,
              updatedAt: new Date()
            }
          }
        }
      });
    }

    // Выполняем массовое обновление
    if (updates.length > 0) {
      const result = await productsCollection.bulkWrite(updates, { ordered: false });
      console.log(`Успешно обновлено: ${result.modifiedCount} продуктов`);
      console.log(`Ошибок при обновлении: ${result.hasWriteErrors?.length || 0}`);
    }

  } catch (error) {
    console.error("Ошибка при массовом добавлении артикулов:", error);
  } finally {
    await client.close();
    console.log("Соединение с MongoDB закрыто");
  }
}

// Запуск скрипта
addArticlesBulk().catch(console.error);