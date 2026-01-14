import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../utils/api-routes";
import Image from "next/image";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>; // ← params это Promise!
}) {
  try {
    // ДОБАВЬ ЭТУ СТРОКУ - распакуй Promise!
    const { id } = await params;

    console.log("Получен ID из URL:", id);

    const db = await getDB();
    let article;

    // Пробуем найти как ObjectId
    try {
      const objectId = new ObjectId(id);

      article = await db.collection("articles").findOne({
        _id: objectId,
      });
    } catch {
      article = await db.collection("articles").findOne({
        _id: id,
      });
    }

    if (!article) {
      return (
        <div>
          <h1>Статья не найдена</h1>
          <p>ID: {id}</p>
        </div>
      );
    }
    console.log(article);
    console.log(article.image);
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{article.name}</h1>

        <div className="flex gap-4 mb-6 text-gray-600">
          <span>Категория: {article.categoryName}</span>
          <span>
            Дата: {new Date(article.createdAt).toLocaleDateString("ru-RU")}
          </span>
        </div>

        <div className="mb-6">
          <Image
            width={200}
            height={150}
            src={article.image}
            alt={article.imageAlt}
            className="w-full max-h-96 object-cover rounded"
          />
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    );
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
    return <div>Ошибка загрузки статьи</div>;
  }
}
