import { MongoClient, Db } from "mongodb";
import { config } from "../config";

let mongoClient: MongoClient | null = null;
let db: Db | null = null;

//Connects to MongoDB.
export const connectToMongo = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  mongoClient = new MongoClient(config.mongoUrl);

  await mongoClient.connect();

  db = mongoClient.db(config.mongoDbName);

  console.log("Successfully Connected to MongoDB", config.mongoDbName);

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

export const getClient = (): MongoClient => {
  if (!mongoClient) {
    throw new Error("MongoDB mongoClient is not connected.");
  }
  return mongoClient;
};

export const disconnectFromMongo = async (): Promise<void> => {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
  db = null;

  console.log("Disconnected from MongoDB");
};
