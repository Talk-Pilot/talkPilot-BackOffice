import express from "express";
import { adminAuth } from "./middlewares/adminAuth";
import clientsRouter from "./routes/admin/clients/clients.routes";

const app = express();
app.use(express.json());

app.use(adminAuth);

app.use("/clients", clientsRouter);

// app.get("/", getAllClients (req, res) => {
//   res.send("Server on");
// });

// app.post("/", updateClient(req, res) => {
//   res.send("Server on");
// });

// app.delete("/:id",deleteClient (req, res) => {
//   res.send("Server on");
// });

export default app;

//middlewares route handlers
