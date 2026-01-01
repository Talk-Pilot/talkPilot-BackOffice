import { Router } from "express";
import { validateBody } from "./validate";
import { createClientBodySchema } from "./clients.schema";
import { createNewClient } from "./clients.controller";

const clientsRouter = Router();

clientsRouter.post("/new", validateBody(createClientBodySchema), createNewClient);

export default clientsRouter;
