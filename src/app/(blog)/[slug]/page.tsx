import { notFound } from "next/navigation";
import { getDB } from "../../../../utils/api-routes";
import ArticleFull from "../ArticleFull";

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const db = await getDB();
  const article = await db.collection("articles").findOne({ 
    slug: params.slug,
    isPublished: true 
  });

  if (!article) {
    notFound();
  }

  return (
    <ArticleFull
      title={article.title}
      content={article.content}
      createdAt={article.createdAt}
      slug={article.slug}
    />
  );
}