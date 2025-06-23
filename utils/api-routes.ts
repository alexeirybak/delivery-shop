import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);

const clientPromise = client.connect();

export const getDB = async () => {
  return (await clientPromise).db(process.env.DELIVERY_SHOP_DB_NAME!);
};
