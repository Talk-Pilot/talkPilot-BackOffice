import dotenv from "dotenv";
import { Config } from "./types";

dotenv.config();

const rawPort = process.env.PORT;
const rawNodeEnv = process.env.NODE_ENV;
const rawMongoUrl = process.env.MONGO_URI;
const rawMongoDbName = process.env.MONGO_DB_NAME;
const rawLogLevel = process.env.LOG_LEVEL;
const rawFirebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const rawFirebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawFirebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const rawAdminUid = process.env.ADMIN_UID;

// config validation b4 app starts for envierment values -  for mongoUrl, adminUid and MongodbName
const getRequiredEnv = (envVariableName: string): string => {
  const envValue = process.env[envVariableName];

  if (!envValue) {
    throw new Error(`Environment variable ${envVariableName} is not set`);
  }
  return envValue;
};

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

let port: number;
if (rawPort) {
  port = Number(rawPort);
} else {
  port = 8000;
}

let firebase = {
  projectId: "",
  clientEmail: "",
  privateKey: "",
};

if (nodeEnv === "production") {
  firebase.projectId = getRequiredEnv("FIREBASE_PROJECT_ID");
  firebase.clientEmail = getRequiredEnv("FIREBASE_CLIENT_EMAIL");
  firebase.privateKey = getRequiredEnv("FIREBASE_PRIVATE_KEY");
} else {
  firebase.projectId = rawFirebaseProjectId || "";
  firebase.clientEmail = rawFirebaseClientEmail || "";
  firebase.privateKey = rawFirebasePrivateKey || "";
}

firebase.privateKey = firebase.privateKey.replace(/\\n/g, "\n");

let adminUid: string;
if (nodeEnv === "production") {
  adminUid = getRequiredEnv("ADMIN_UID");
} else {
  adminUid = rawAdminUid || "";
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
  mongoUrl,
  mongoDbName,
  logLevel,
  adminUid,
  firebase,
};

// my note:
// i want that only config will "touch the environment variables"
// dontenv - take the file and load it into the process.env
