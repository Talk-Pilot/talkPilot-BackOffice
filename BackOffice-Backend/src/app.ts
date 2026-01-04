import express from "express";
import { adminAuth } from "./middlewares/adminAuth";
import clientsRouter from "./routes/admin/clients/clients.routes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server on");
});
app.use(adminAuth);

app.use("/clients", clientsRouter);

export default app;

//middlewares route handlers
