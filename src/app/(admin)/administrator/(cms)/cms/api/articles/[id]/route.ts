// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import { getDB } from "../../../../../../../../../utils/api-routes";

// interface ArticleDocument {
//   _id: ObjectId;
//   name: string;
//   slug: string;
//   description?: string;
//   keywords?: string[];
//   image?: string;
//   imageAlt?: string;
//   content: string;
//   author?: string;
//   categoryId?: string;
//   categoryName?: string;
//   categorySlug?: string;
//   isFeatured?: boolean;
//   status?: string;
//   publishedAt?: string;
// }

// interface ArticleResponse {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   keywords: string[];
//   image: string;
//   imageAlt: string;
//   content: string;
//   author: string;
//   categoryId: string;
//   categoryName: string;
//   categorySlug: string;
//   isFeatured: boolean;
//   status: string;
//   publishedAt?: string;
// }

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const db = await getDB();

//     const article = await db.collection<ArticleDocument>("articles").findOne({
//       _id: ObjectId.createFromHexString(id),
//     });

//     if (!article) {
//       return NextResponse.json(
//         { success: false, message: "Статья не найдена" },
//         { status: 404 },
//       );
//     }

//     // Преобразуем в форму для редактирования
//     const responseData: ArticleResponse = {
//       _id: article._id.toString(),
//       name: article.name,
//       slug: article.slug,
//       description: article.description || "",
//       keywords: article.keywords || [],
//       image: article.image || "",
//       imageAlt: article.imageAlt || "",
//       content: article.content,
//       author: article.author || "",
//       categoryId: article.categoryId || "",
//       categoryName: article.categoryName || "",
//       categorySlug: article.categorySlug || "",
//       isFeatured: article.isFeatured || false,
//       status: article.status || "draft",
//       publishedAt: article.publishedAt,
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         data: responseData,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Ошибка загрузки статьи:", error);
//     return NextResponse.json(
//       { success: false, message: "Ошибка загрузки статьи" },
//       { status: 500 },
//     );
//   }
// }