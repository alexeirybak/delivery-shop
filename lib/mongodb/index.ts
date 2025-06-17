import { MongoClient } from "mongodb";

const clientPromise = MongoClient.connect(
  process.env.DELIVERY_SHOP_DB_URL as string,
  { maxPoolSize: 10 }
);

export default clientPromise;
