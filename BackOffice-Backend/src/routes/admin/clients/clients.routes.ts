// only direct the request to the controller
// no business logic here

import { Router } from "express";
import { validateBody } from "./validate";
import { createClientBodySchema } from "./clients.schema";
import { createNewClient } from "./clients.controller";

const clientsRouter = Router();

clientsRouter.post("/new", validateBody(createClientBodySchema), createNewClient);

export default clientsRouter;
