import express from "express";
import { adminAuth } from "./middlewares/adminAuth";
import clientsRouter from "./routes/admin/clients/clients.routes";

const app = express();
app.use(express.json());

app.use(adminAuth);

app.use("/clients", clientsRouter);
app.use("/clients", (req, res, next) => {
  console.log("🔥 Route hit:", req.method, req.path);
  next();
});

export default app;
