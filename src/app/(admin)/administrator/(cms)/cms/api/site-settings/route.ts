import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";
import { SiteSettings } from "../../types/siteSettings";

// GET - Получение настроек (с атомарным созданием если нет)
export async function GET() {
  try {
    const db = await getDB();

    // Атомарно находим или создаем настройки
    const result = await db
      .collection<SiteSettings>("site-settings")
      .findOneAndUpdate(
        {}, // пустой фильтр - ищем любой документ
        {
          $setOnInsert: {
            siteKeywords: ["ваш", "сайт", "ключевые", "слова"],
            semanticCore: ["основные", "тематики", "сайта"],
            metaDescription: "Описание вашего сайта",
            siteTitle: "Название вашего сайта",
            updatedAt: new Date().toISOString(),
          },
        },
        {
          upsert: true, // создать если нет
          returnDocument: "after", // вернуть документ после операции
        }
      );

    if (!result) {
      // Если по какой-то причине документ не создался
      const defaultSettings: SiteSettings = {
        _id: new ObjectId(),
        siteKeywords: ["ваш", "сайт", "ключевые", "слова"],
        semanticCore: ["основные", "тематики", "сайта"],
        metaDescription: "Описание вашего сайта",
        siteTitle: "Название вашего сайта",
        updatedAt: new Date().toISOString(),
      };

      await db
        .collection<SiteSettings>("site-settings")
        .insertOne(defaultSettings);

      return NextResponse.json({
        success: true,
        data: {
          ...defaultSettings,
          _id: defaultSettings._id.toString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка получения настроек:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения настроек" },
      { status: 500 }
    );
  }
}

// PUT - Обновление настроек
export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const data = await request.json();

    // Атомарное обновление или создание
    const result = await db
      .collection<SiteSettings>("site-settings")
      .findOneAndUpdate(
        {}, // ищем любой документ
        {
          $set: {
            siteKeywords: data.siteKeywords || [],
            semanticCore: data.semanticCore || [],
            metaDescription: data.metaDescription || "",
            siteTitle: data.siteTitle || "",
            updatedAt: new Date().toISOString(),
          },
        },
        {
          upsert: true, // создать если нет
          returnDocument: "after", // вернуть обновленный документ
        }
      );

    return NextResponse.json({
      success: true,
      message: result ? "Настройки обновлены" : "Настройки созданы",
      data: result
        ? {
            ...result,
            _id: result._id.toString(),
          }
        : null,
    });
  } catch (error) {
    console.error("Ошибка сохранения настроек:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сохранения настроек" },
      { status: 500 }
    );
  }
}
