import { MongoClient } from "mongodb";

export const getDBAndRequestBody = async (
  clientPromise: Promise<MongoClient>,
  req: Request | null
) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME);

    if (req) {
      const reqBody = await req.json();
      return { db, reqBody };
    }

    return { db };
  } catch (error) {
    console.error('Ошибка соединения с базой данных', error);
    throw error;
  }
};