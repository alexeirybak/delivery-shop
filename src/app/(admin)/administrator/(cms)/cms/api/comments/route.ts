import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";


interface CommentFilter {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  authorName?: { $regex: string; $options: string };
  articleId?: { $in: string[] };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const author = searchParams.get("author");
    const article = searchParams.get("article");

    console.log("Поиск по статье:", article); // Логируем поисковый запрос

    const db = await getDB();
    
    // Сначала получаем ID статей, если ищем по названию
    let articleIds: string[] = [];
    if (article) {
      const articles = await db.collection("articles")
        .find({
          name: { $regex: article, $options: "i" }
        })
        .project({ _id: 1, name: 1 })
        .toArray();
      
      console.log("Найденные статьи:", articles); // Логируем найденные статьи
      
      articleIds = articles.map(a => a._id.toString());
      
      if (articleIds.length === 0) {
        console.log("Статьи не найдены, возвращаем пустой результат");
        return NextResponse.json({
          comments: [],
          totalPages: 0,
          totalItems: 0,
          totalAllItems: await db.collection("comments").countDocuments(),
        });
      }
    }

    const filter: CommentFilter = {};

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = fromDate;
      }
      
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    if (author) {
      filter.authorName = { $regex: author, $options: "i" };
    }

    if (articleIds.length > 0) {
      filter.articleId = { $in: articleIds };
    }

    console.log("Финальный фильтр:", JSON.stringify(filter, null, 2));

    const skip = (page - 1) * limit;
    
    const [comments, totalFiltered, totalAll] = await Promise.all([
      db.collection("comments")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("comments").countDocuments(filter),
      db.collection("comments").countDocuments()
    ]);

    console.log(`Найдено комментариев: ${comments.length}, всего: ${totalFiltered}`);

    const uniqueArticleIds = [...new Set(comments.map(c => c.articleId))];
    
    const articles = await db.collection("articles")
      .find({ _id: { $in: uniqueArticleIds.map(id => ObjectId.createFromHexString(id)) } })
      .toArray();

    const articleMap = new Map();
    articles.forEach(a => articleMap.set(a._id.toString(), a));

    const formatted = comments.map(comment => ({
      ...comment,
      _id: comment._id.toString(),
      articleName: articleMap.get(comment.articleId)?.name || "Статья удалена",
      articleSlug: articleMap.get(comment.articleId)?.slug || "",
      categorySlug: articleMap.get(comment.articleId)?.categorySlug || "",
      createdAt: comment.createdAt,
    }));

    return NextResponse.json({
      comments: formatted,
      totalPages: Math.ceil(totalFiltered / limit),
      totalItems: totalFiltered,
      totalAllItems: totalAll,
    });
  } catch (error) {
    console.error("Ошибка API комментариев:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}