import dotenv from "dotenv";
import { Config } from "./types";

dotenv.config();

const rawPort = process.env.PORT;
const rawNodeEnv = process.env.NODE_ENV;
const rawAdminToken = process.env.ADMIN_TOKEN;
const rawMongoUrl = process.env.MONGO_URI;
const rawMongoDbName = process.env.MONGO_DB_NAME;
const rawLogLevel = process.env.LOG_LEVEL;

// config validation b4 app starts for envierment values -  for mongoUrl, adminToken and MongodbName
const getRequiredEnv = (envVariableName: string): string => {
  const envValue = process.env[envVariableName];

  if (!envValue) {
    throw new Error(`Environment variable ${envVariableName} is not set`);
  }
  return envValue;
};

let port: number;
if (rawPort) {
  port = Number(rawPort);
} else {
  port = 8000;
}

let nodeEnv: "development" | "production" | "local";
if (
  rawNodeEnv === "development" ||
  rawNodeEnv === "production" ||
  rawNodeEnv === "local"
) {
  nodeEnv = rawNodeEnv as "development" | "production" | "local";
} else {
  nodeEnv = "development";
}

let adminToken: string;
if (nodeEnv === "production") {
  adminToken = getRequiredEnv("ADMIN_TOKEN");
} else {
  adminToken = rawAdminToken || "dev-admin-token";
}

let mongoDbName: string;
if (nodeEnv === "production") {
  mongoDbName = getRequiredEnv("MONGO_DB_NAME");
} else {
  mongoDbName = rawMongoDbName || "backoffice_dev";
}

let mongoUrl: string;
if (nodeEnv === "production") {
  mongoUrl = getRequiredEnv("MONGO_URI");
} else {
  mongoUrl = rawMongoUrl || "mongodb://localhost:27017";
}

let logLevel: "info" | "warn" | "error";

if (
  rawLogLevel === "info" ||
  rawLogLevel === "warn" ||
  rawLogLevel === "error"
) {
  logLevel = rawLogLevel;
} else {
  logLevel = "warn";
}

export const config: Config = {
  port,
  nodeEnv,
  adminToken,
  mongoUrl,
  mongoDbName,
  logLevel,
};

// my note:
// i want that only config will "touch the environment variables"
// dontenv - take the file and load it into the process.env
