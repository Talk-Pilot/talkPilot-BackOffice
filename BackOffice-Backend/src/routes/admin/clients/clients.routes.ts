// only direct the request to the controller
// no business logic here

import { Router } from "express";
import { validateBody } from "./validate";
import { createClientBodySchema, updateClientBodySchema } from "./clients.schema";
import { createNewClient, getAllClients ,updateClientByClientId} from "./clients.controller";

const clientsRouter = Router();

clientsRouter.get("/all", getAllClients);

clientsRouter.post(
  "/new",
  validateBody(createClientBodySchema),
  createNewClient
);
clientsRouter.put("/clientId/:clientId", validateBody(updateClientBodySchema), updateClientByClientId);


// clientsRouter.get("/:id", getClientById);
// clientsRouter.delete("/:id", deleteClient);

export default clientsRouter;
