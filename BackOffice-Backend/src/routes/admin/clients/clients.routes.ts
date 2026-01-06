// only direct the request to the controller
// no business logic here

import { Router } from "express";
import { validateBody } from "./validate";
import { createClientBodySchema } from "./clients.schema";
import { createNewClient } from "./clients.controller";

const clientsRouter = Router();

clientsRouter.post("/new", validateBody(createClientBodySchema), createNewClient);

// clientsRouter.get("/all", getAllClients);
// clientsRouter.put("/:id", validateBody(updateClientBodySchema), updateClient);
// clientsRouter.get("/:id", getClientById);
// clientsRouter.delete("/:id", deleteClient);

export default clientsRouter;
