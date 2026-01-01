import { MongoClient, Db } from "mongodb";
import { config } from "../config";

let client: MongoClient | null = null;
let db: Db | null = null;

//Connects to MongoDB.
export const connectToMongo = async (): Promise<Db> => {
  // falsy - if null we can keep going to connect to mongo
  if (db) {
    return db;
  }

  client = new MongoClient(config.mongoUrl);

  await client.connect();

  db = client.db(config.mongoDbName);

  console.log("Successfully Connected to MongoDB");

  return db;
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error(
      "MongoDB is not connected. Call connectToMongo() before using the database."
    );
  }

  return db;
};

export const disconnectFromMongo = async (): Promise<void> => {
  if (!client) {
    return;
  }

  await client.close();
  client = null;
  db = null;

  console.log("Disconnected from MongoDB");
};
