import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { Db } from "mongodb";

export async function POST() {
  console.log("🚀 Запуск генерации статьи С ОЖИДАНИЕМ изображений");
  const startTime = Date.now();
  
  try {
    const db = await getDB();
    
    // 1. ВЫБОР ТЕМЫ
    const topic = "Польза моркови для зрения";
    console.log(`📌 Тема: ${topic}`);
    
    // 2. КАТЕГОРИЯ
    const category = await db.collection("article-category").findOne({ 
      slug: "ovoschi" 
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 }
      );
    }

    // 3. ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЯ (ЖДЕМ РЕАЛЬНО!)
    console.log("🎨 ЗАПУСКАЕМ ГЕНЕРАЦИЮ ИЗОБРАЖЕНИЯ...");
    
    let imageUrl = '';
    const prompt = "свежая морковь на темном фоне, макросъемка, детализированная фотография";
    
    try {
      // Шаг 1: Запуск генерации
      console.log("📤 Отправляем запрос на генерацию...");
      const generateResponse = await fetch(
        'http://localhost:3000/administrator/cms/api/articles/yandex-image',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt,
            aspect_ratio: "16:9",
            style: "realistic"
          }),
        }
      );

      if (!generateResponse.ok) {
        throw new Error(`HTTP ${generateResponse.status}`);
      }

      const generateData = await generateResponse.json();
      console.log("📦 Ответ на запуск:", generateData);
      
      if (!generateData.success || !generateData.operationId) {
        throw new Error(generateData.error || 'Нет operationId');
      }

      const operationId = generateData.operationId;
      console.log(`✅ Генерация запущена. ID: ${operationId}`);
      console.log("⏳ Ждем 60-90 секунд...");

      // Шаг 2: Ожидаем завершения (реальные 90 секунд!)
      let attempts = 0;
      const maxAttempts = 30; // 30 * 3 = 90 секунд
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Проверка ${attempts}/${maxAttempts}...`);
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Ждем 3 секунды
        
        try {
          const checkResponse = await fetch(
            `http://localhost:3000/administrator/cms/api/articles/yandex-image?operationId=${operationId}`,
            { headers: { 'Accept': 'application/json' } }
          );

          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            
            if (checkData.done) {
              if (checkData.success && checkData.imageUrl) {
                imageUrl = checkData.imageUrl;
                console.log(`✅ ИЗОБРАЖЕНИЕ ГОТОВО за ${attempts * 3} секунд!`);
                console.log(`📸 URL: ${imageUrl}`);
                break;
              } else {
                console.error("❌ Ошибка генерации:", checkData.error);
                break;
              }
            }
          }
        } catch (checkError) {
          console.warn("⚠️  Ошибка проверки:", checkError);
        }
      }
      
      if (!imageUrl) {
        console.warn("⚠️  Изображение не сгенерировано за отведенное время");
      }
      
    } catch (imageError) {
      console.error("❌ Ошибка генерации изображения:", imageError);
    }

    const imageTime = Date.now() - startTime;
    console.log(`⏱️  Время на изображение: ${Math.floor(imageTime / 1000)} секунд`);

    // 4. ГЕНЕРАЦИЯ ТЕКСТА
    console.log("📝 Генерация текста статьи...");
    
    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
    
    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      throw new Error("API ключи не настроены");
    }

    let articleText = '';
    
    // Подготовка текста с изображением
    let contentWithImage = '';
    if (imageUrl) {
      contentWithImage = `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${imageUrl}" alt="${topic}" style="max-width: 100%; height: auto; border-radius: 8px;">
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Изображение сгенерировано нейросетью</p>
        </div>
      `;
    }

    try {
      const gptResponse = await fetch(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${YANDEX_API_KEY}`,
          },
          body: JSON.stringify({
            modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt`,
            completionOptions: { temperature: 0.7, maxTokens: 800 },
            messages: [
              {
                role: "system",
                text: `Напиши статью про овощи. Используй HTML: <h1>, <h2>, <p>, <ul>, <li>.
                ${imageUrl ? 'В начале статьи будет изображение.' : ''}`
              },
              {
                role: "user",
                text: `Напиши статью на тему "${topic}". ${
                  imageUrl 
                    ? `После заголовка добавь этот HTML: ${contentWithImage}` 
                    : ''
                }
                Длина: 400-500 символов.`
              },
            ],
          }),
        }
      );

      const gptData = await gptResponse.json();
      articleText = gptData.result?.alternatives?.[0]?.message?.text || '';
      
      if (!articleText) {
        articleText = `<h1>${topic}</h1>${imageUrl ? contentWithImage : ''}<p>Статья о пользе моркови для зрения.</p>`;
      }
      
      console.log(`✅ Текст: ${articleText.length} символов`);
      
    } catch (gptError) {
      console.error("❌ Ошибка GPT:", gptError);
      articleText = `<h1>${topic}</h1>${imageUrl ? contentWithImage : ''}<p>Статья о пользе моркови для зрения.</p>`;
    }

    // 5. СОХРАНЕНИЕ В БАЗУ
    console.log("💾 Сохраняем статью...");
    
    const slug = `article-${Date.now()}`;
    const numericId = await getNextNumericId(db);
    
    const articleData = {
      numericId,
      name: topic,
      slug,
      description: articleText.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
      image: imageUrl,
      imageAlt: topic,
      author: "Рыбак Алексей",
      categoryId: category._id,
      categoryName: category.name,
      categorySlug: category.slug,
      content: articleText,
      status: "published",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      generatedWithImage: !!imageUrl,
      totalTimeSeconds: Math.floor((Date.now() - startTime) / 1000)
    };

    const result = await db.collection("articles").insertOne(articleData);
    
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`\n🎉 СТАТЬЯ СОЗДАНА за ${totalTime} секунд!`);
    console.log(`📊 ID: ${result.insertedId}`);
    console.log(`🖼️  Изображение: ${imageUrl ? '✅' : '❌'}`);
    
    if (imageUrl) {
      console.log(`📸 URL: ${imageUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: "Статья создана",
      data: {
        id: result.insertedId.toString(),
        numericId,
        name: topic,
        slug,
        hasImage: !!imageUrl,
        imageUrl,
        totalTime,
        url: `/articles/${slug}`
      }
    });

  } catch (error) {
    console.error("💥 Ошибка:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка генерации",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

async function getNextNumericId(db: Db): Promise<number> {
  const lastArticle = await db.collection("articles")
    .find({})
    .sort({ numericId: -1 })
    .limit(1)
    .toArray();
  
  return lastArticle.length > 0 ? lastArticle[0].numericId + 1 : 1;
}