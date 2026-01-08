export type Config = {
  port: number;
  nodeEnv: "development" | "production" | "local";
  adminUid: string;
  mongoUrl: string;
  mongoDbName: string;
  logLevel: "info" | "warn" | "error"; // "debug" | "info" | "warn" | "error";
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
};
