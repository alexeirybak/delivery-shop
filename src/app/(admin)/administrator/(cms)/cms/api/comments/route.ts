import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";

interface DateFilter {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const db = await getDB();
    
    const filter: DateFilter = {};

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

    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      db.collection("comments")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("comments").countDocuments(filter)
    ]);

    const articleIds = comments.map(c => c.articleId);
    
    if (articleIds.length === 0) {
      return NextResponse.json({
        comments: [],
        totalPages: 0,
      });
    }

    const articles = await db.collection("articles")
      .find({ _id: { $in: articleIds.map(id => new ObjectId(id)) } })
      .toArray();

    const articleMap = new Map();
    articles.forEach(a => articleMap.set(a._id.toString(), a));

    const formatted = comments.map(comment => ({
      ...comment,
      _id: comment._id.toString(),
      articleName: articleMap.get(comment.articleId)?.name || "Статья удалена",
      articleSlug: articleMap.get(comment.articleId)?.slug || "",
      categorySlug: articleMap.get(comment.articleId)?.categorySlug || "",
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json({
      comments: formatted,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Ошибка API комментариев:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}