export type Config = {
  port: number;
  nodeEnv: "development" | "production" | "local";
  adminToken: string;
  mongoUrl: string;
  mongoDbName: string;
  logLevel: "info" | "warn" | "error"; // "debug" | "info" | "warn" | "error";
};
