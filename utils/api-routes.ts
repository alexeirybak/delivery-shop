import { MongoClient } from "mongodb";
const clientPromise = new MongoClient(process.env.MongoURL!);
const db = clientPromise.db("delivery-shop");

export const getDBAndRequestBody = async (
  clientPromise: Promise<MongoClient>,
  request: Request | null
) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DELIVERY_SHOP_DB_NAME);

    if (request) {
      const requestBody = await request.json();
      return { db, requestBody };
    }

    return { db };
  } catch (error) {
    console.error("Ошибка соединения с базой данных", error);
    throw error;
  }
};

export async function getArticles() {
  return await db.collection("articles").find().toArray();
}

export async function getProductsByCategory(category: string) {
  return await db
    .collection("products")
    .find({ categories: category })
    .toArray();
}

export async function getPurchases() {
  const user = await db.collection("users").findOne({});

  if (!user?.purchases?.length) return [];

  const productIds = user.purchases.map((p: { id: number }) => p.id);
  const products = await db
    .collection("products")
    .find({ id: { $in: productIds } })
    .toArray();

  return products.map((product) => {
    const { discountPercent, ...rest } = product;
    void discountPercent;
    return {
      ...rest,
    };
  });
}
