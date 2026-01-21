import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../utils/api-routes";
import Image from "next/image";
import { sanitizeArticleHTML } from "./utils/sanitize-html";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    const db = await getDB();
    let article;

    // Пробуем найти как ObjectId
    if (ObjectId.isValid(id)) {
      const objectId = new ObjectId(id);
      article = await db.collection("articles").findOne({ _id: objectId });
    }
    
    // Если не нашли по ObjectId, ищем по slug
    if (!article) {
      article = await db.collection("articles").findOne({ slug: id });
    }

    if (!article) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <p className="text-gray-600">ID: {id}</p>
        </div>
      );
    }

    const safeContent = sanitizeArticleHTML(article.content || "");

    // Проверка основного изображения
    const hasMainImage = article.image && 
                        article.image.trim() !== "" && 
                        article.image.startsWith('/');

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{article.name}</h1>

        <div className="flex gap-4 mb-6 text-gray-600">
          {article.categoryName && (
            <span>Категория: {article.categoryName}</span>
          )}
          {article.published && (
            <span>
              Дата: {new Date(article.published).toLocaleDateString("ru-RU")}
            </span>
          )}
        </div>

        {hasMainImage && (
          <div className="mb-6">
            <Image
              width={800}
              height={450}
              src={article.image}
              alt={article.imageAlt || article.name}
              className="w-full max-h-96 object-cover rounded"
              priority
            />
          </div>
        )}
        <div
          className="prose max-w-none article-content mb-8"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
        {article.author && (
            <span className="italic">
              Автор: {article.author}
            </span>
          )}
      </div>
    );
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
    return <div>Ошибка загрузки статьи</div>;
  }
}