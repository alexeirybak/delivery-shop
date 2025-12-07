import ArticleCard from "../(articles)/ArticleCard";
import { getDB } from "../../../utils/api-routes";

export default async function BlogPage() {
  const db = await getDB();
  const articles = await db.collection("articles")
    .find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Статьи</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article._id.toString()}
            title={article.title}
            createdAt={article.createdAt}
            text={article.description || "Читать статью..."}
            slug={article.slug}
            content={article.content} // ← HTML с изображениями
          />
        ))}
      </div>
    </div>
  );
}