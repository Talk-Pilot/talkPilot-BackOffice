import { config } from "./core/config";
import app from "./app";
import { connectToMongo } from "./core/db/mongo";

async function startServer() {
  await connectToMongo();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
  });
}

// 3. fail fast if something critical breaks
startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
