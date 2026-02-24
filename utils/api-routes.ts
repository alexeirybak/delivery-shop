import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_CONNECTION_STRING!);

const clientPromise = client.connect();

export const getDB = async () => {
  return (await clientPromise).db(process.env.DBNAME!);
};
