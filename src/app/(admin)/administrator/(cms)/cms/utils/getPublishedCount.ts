import { getDB } from "../../../../../../../utils/api-routes";

export async function getPublishedCount(): Promise<number> {
  try {
    const db = await getDB();

    const count = await db.collection("articles").countDocuments({
      status: "published",
    });

    return count;
  } catch (error) {
    console.error("Ошибка при подсчете опубликованных статей:", error);
    return 0;
  }
}
