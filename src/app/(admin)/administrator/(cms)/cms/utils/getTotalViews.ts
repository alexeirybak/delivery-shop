import { getDB } from "../../../../../../../utils/api-routes";

export async function getTotalViews(): Promise<number> {
  try {
    const db = await getDB();
    
    // Агрегация для подсчета суммы просмотров всех опубликованных статей
    const result = await db.collection("articles")
      .aggregate([
        {
          $match: {
            status: "published"
          }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$views", 0] } }
          }
        }
      ])
      .toArray();

    return result[0]?.totalViews || 0;
  } catch (error) {
    console.error("Ошибка при подсчете просмотров:", error);
    return 0;
  }
}