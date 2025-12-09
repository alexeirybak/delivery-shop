import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../utils/api-routes";

interface SiteSettings {
  _id: ObjectId;
  siteKeywords: string[];
  semanticCore: string[];
  metaDescription: string;
  siteTitle: string;
  updatedAt: string;
}

// GET - Получение настроек
export async function GET() {
  try {
    const db = await getDB();

    // Ищем первый документ в коллекции
    let settings = await db
      .collection<SiteSettings>("site-settings")
      .findOne({});

    // Если настроек нет, создаем дефолтные
    if (!settings) {
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

      settings = defaultSettings;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        _id: settings._id.toString(),
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

// PUT - Обновление настроек (всегда обновляем первый документ)
export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const data = await request.json();

    // Сначала найдем существующий документ
    const existingSettings = await db
      .collection<SiteSettings>("site-settings")
      .findOne({});

    if (existingSettings) {
      // Обновляем существующий документ
      const result = await db
        .collection<SiteSettings>("site-settings")
        .updateOne(
          { _id: existingSettings._id },
          {
            $set: {
              siteKeywords: data.siteKeywords || [],
              semanticCore: data.semanticCore || [],
              metaDescription: data.metaDescription || "",
              siteTitle: data.siteTitle || "",
              updatedAt: new Date().toISOString(),
            },
          }
        );

      return NextResponse.json({
        success: true,
        message: "Настройки обновлены",
        updated: result.modifiedCount > 0,
      });
    } else {
      // Создаем новый документ
      const newSettings: SiteSettings = {
        _id: new ObjectId(),
        siteKeywords: data.siteKeywords || [],
        semanticCore: data.semanticCore || [],
        metaDescription: data.metaDescription || "",
        siteTitle: data.siteTitle || "",
        updatedAt: new Date().toISOString(),
      };

      await db.collection<SiteSettings>("site-settings").insertOne(newSettings);

      return NextResponse.json({
        success: true,
        message: "Настройки созданы",
        created: true,
      });
    }
  } catch (error) {
    console.error("Ошибка сохранения настроек:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сохранения настроек" },
      { status: 500 }
    );
  }
}
