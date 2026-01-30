// import { NextRequest, NextResponse } from "next/server";
// import { Article, Category } from "@/app/(blog)/blog/types";
// import { getDB } from "../../../../../utils/api-routes";

// interface RouteParams {
//   params: Promise<{ category: string; article: string }>;
// }

// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { category: categorySlug, article: articleSlug } = await params;
//     const db = await getDB();

//     // 1. Получаем категорию
//     const categoryDoc = await db.collection("article-category").findOne({
//       slug: categorySlug,
//     });

//     if (!categoryDoc) {
//       return NextResponse.json(
//         { error: "Категория не найдена" },
//         { status: 404 },
//       );
//     }

//     // 2. Получаем статью
//     const articleDoc = await db.collection("articles").findOne({
//       slug: articleSlug,
//       categoryId: categoryDoc._id.toString(),
//       status: "published", // Добавляем проверку статуса, если есть
//     });

//     if (!articleDoc) {
//       return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
//     }

//     // 3. Преобразуем данные
//     const category: Category = {
//       _id: categoryDoc._id.toString(),
//       name: categoryDoc.name,
//       slug: categoryDoc.slug,
//       description: categoryDoc.description,
//       image: categoryDoc.image,
//       imageAlt: categoryDoc.imageAlt,
//       keywords: categoryDoc.keywords,
//     };

//     const article: Article = {
//       _id: articleDoc._id.toString(),
//       slug: articleDoc.slug,
//       name: articleDoc.name,
//       content: articleDoc.content,
//       description: articleDoc.description,
//       image: articleDoc.image,
//       imageAlt: articleDoc.imageAlt,
//       publishedAt: articleDoc.publishedAt,
//       author: articleDoc.author,
//     };

//     return NextResponse.json({
//       article,
//       category,
//     });
//   } catch (error) {
//     console.error("Ошибка в API статьи:", error);
//     return NextResponse.json(
//       { error: "Внутренняя ошибка сервера" },
//       { status: 500 },
//     );
//   }
// }
