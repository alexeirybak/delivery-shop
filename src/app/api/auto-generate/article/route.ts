import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { Db } from "mongodb";

export async function POST() {
  try {
    console.log("🚀 Запуск авто-генерации статьи");

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      return NextResponse.json(
        {
          error: "YandexGPT API не настроен",
        },
        { status: 500 },
      );
    }

    const db = await getDB();

    // Темы для статей про овощи
    const topics = [
      "Польза моркови для зрения",
      "Как правильно выращивать помидоры", 
      "Брокколи - суперфуд для здоровья",
      "Картофель: вред и польза",
      "Огурцы для похудения и здоровья кожи",
      "Тыква - осенний витаминный комплекс",
      "Лук и чеснок для иммунитета",
      "Свекла для очищения организма",
      "Кабачки в диетическом питании",
      "Болгарский перец - источник витамина C"
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`📌 Тема: ${randomTopic}`);

    // ===== 1. ПОЛУЧЕНИЕ КАТЕГОРИИ "OVOSCHI" =====
    console.log("📂 Поиск категории 'ovoschi'...");
    
    const category = await db.collection("article-category").findOne({ 
      slug: "ovoschi" 
    });
    
    if (!category) {
      console.error("❌ Категория 'ovoschi' не найдена!");
      return NextResponse.json(
        {
          error: "Категория 'ovoschi' не найдена",
          suggestion: "Создайте категорию с slug: 'ovoschi'"
        },
        { status: 404 },
      );
    }
    
    console.log(`✅ Найдена категория: ${category.name} (${category.slug})`);

    // ===== 2. ГЕНЕРАЦИЯ ТЕКСТА (ТЕМА ПРО ОВОЩИ) =====
    console.log("📝 Генерация текста статьи про овощи...");
    
    const gptResponse = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${YANDEX_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt`,
          completionOptions: {
            stream: false,
            temperature: 0.7,
            maxTokens: 2000,
          },
          messages: [
            {
              role: "system",
              text: `Ты опытный диетолог и агроном. Пиши подробные, информативные статьи о пользе овощей, их выращивании и приготовлении.
              ВАЖНО: Ты должен возвращать ТОЛЬКО содержимое внутри тега <body>, без <html>, <head>, <meta>, <title>, <body> и </body> тегов.
              Используй только следующие HTML теги: <h1>, <h2>, <h3>, <h4>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
              Не используй <!DOCTYPE html>, <html>, <head>, <meta>, <title>, <body>, <div>, <span>, <section> и другие структурные теги.`,
            },
            {
              role: "user",
              text: `Напиши развернутую статью на тему: "${randomTopic}". 
              Статья должна содержать введение, основную часть и заключение.
              Используй только HTML разметку для заголовков (<h1>, <h2>, <h3>, <h4>) и параграфов (<p>).
              Пиши в научно-популярном стиле, доступно для обычных читателей.
              ВОЗВРАЩАЙ ТОЛЬКО СОДЕРЖИМОЕ СТАТЬИ, БЕЗ ВНЕШНИХ HTML ТЕГОВ.`,
            },
          ],
        }),
      },
    );

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error("YandexGPT API error:", gptResponse.status, errorText);
      throw new Error(`GPT API error: ${gptResponse.status}`);
    }

    const gptData = await gptResponse.json();
    let articleText = gptData.result?.alternatives?.[0]?.message?.text || "";

    if (!articleText) {
      throw new Error("Пустой ответ от YandexGPT");
    }

    // ===== 3. ОЧИСТКА HTML: УДАЛЕНИЕ ВСЕХ ВНЕШНИХ ТЕГОВ =====
    console.log("🧹 Очистка HTML от внешних тегов...");
    
    // 1. Удаляем DOCTYPE, html, head, title, body теги полностью
    articleText = articleText
      .replace(/<!DOCTYPE\s+[^>]*>/gi, '')
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // 2. Удаляем лишние пробелы и переносы
    articleText = articleText
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // 3. Проверяем, что остались только разрешенные теги
    // Удаляем все другие теги кроме разрешенных
    const allowedTags = ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em'];
    const tagRegex = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;
    
    // Находим все теги в тексте и удаляем неразрешенные
    let match;
    while ((match = tagRegex.exec(articleText)) !== null) {
      const tagName = match[1].toLowerCase();
      if (!allowedTags.includes(tagName)) {
        // Заменяем неразрешенный тег на пустую строку
        articleText = articleText.replace(match[0], '');
      }
    }

    // 4. Проверяем результат
    if (articleText.trim().length === 0) {
      console.warn("⚠️  После очистки текст пустой, использую оригинал");
      // Если после очистки текст пустой, берем оригинал и убираем только основные теги
      articleText = gptData.result?.alternatives?.[0]?.message?.text || "";
      articleText = articleText
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<html[^>]*>/gi, '')
        .replace(/<\/html>/gi, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<body[^>]*>/gi, '')
        .replace(/<\/body>/gi, '')
        .trim();
    }

    console.log(`✅ Текст очищен (${articleText.length} символов)`);

    // ===== 4. СОХРАНЕНИЕ В БАЗУ =====
    console.log("💾 Сохранение в базу данных...");

    // Создаем slug статьи
    const articleSlug = randomTopic.toLowerCase()
      .replace(/[а-яё]/g, (match: string) => {
        const ru: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
          'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return ru[match] || match;
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Проверяем, существует ли уже статья с таким slug
    const existingArticle = await db.collection("articles").findOne({
      slug: articleSlug,
    });

    const finalSlug = existingArticle ? `${articleSlug}-${Date.now()}` : articleSlug;

    // Создаем описание (очищенное от HTML)
    const cleanDescription = articleText
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .substring(0, 150)
      .trim() + "...";

    // Ключевые слова из темы + овощи
    const keywords = [
      ...randomTopic.toLowerCase().split(' ').filter(word => word.length > 3),
      'овощи',
      'здоровое питание',
      'польза',
      'витамины',
      'агрономия'
    ].slice(0, 5);

    // Получаем numericId
    const numericId = await getNextNumericId(db);

    // Формируем данные статьи
    const articleData = {
      numericId: numericId,
      name: randomTopic,
      slug: finalSlug,
      description: cleanDescription,
      
      keywords: keywords,
      image: "",
      imageAlt: randomTopic,
      
      author: "Рыбак Алексей",
      
      // Категория
      categoryId: category._id.toString(),
      categoryName: category.name,
      categorySlug: category.slug,
      
      // Контент (очищенный от внешних тегов)
      content: articleText,
      isFeatured: false,
      status: "published",
      views: 0,
      
      // Даты
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    const result = await db.collection("articles").insertOne(articleData);

    console.log("🎉 Статья про овощи создана успешно!");
    console.log("📊 Данные статьи:", {
      numericId: numericId,
      name: articleData.name,
      slug: articleData.slug,
      categoryName: articleData.categoryName,
      categorySlug: articleData.categorySlug,
      categoryId: articleData.categoryId,
      views: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Статья про овощи создана успешно",
      articleId: result.insertedId,
      numericId: numericId,
      topic: randomTopic,
      slug: finalSlug,
      category: {
        name: category.name,
        slug: category.slug,
        id: category._id.toString()
      },
      contentPreview: articleText.substring(0, 200) + "..."
    });
  } catch (error) {
    console.error("❌ Ошибка авто-генерации:", error);
    return NextResponse.json(
      {
        error: "Ошибка генерации статьи про овощи",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Вспомогательная функция для numericId
async function getNextNumericId(db: Db): Promise<number> {
  try {
    const lastArticle = await db.collection("articles")
      .find({})
      .sort({ numericId: -1 })
      .limit(1)
      .toArray();
    
    if (lastArticle.length > 0 && lastArticle[0].numericId) {
      return lastArticle[0].numericId + 1;
    }
    
    return 1;
  } catch (error) {
    console.error("Ошибка получения numericId:", error);
    return 1;
  }
}