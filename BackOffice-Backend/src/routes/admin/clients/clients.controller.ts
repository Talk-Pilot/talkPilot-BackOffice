//transfer the http request to "code"
// req to body
// call the service
// return the response

import { Request, Response } from "express";
import { CreateClientBodyType } from "./clients.types";
import { createClientService } from "./clients.service";

export const createNewClient = async (req: Request, res: Response) => {
  try {
    const clientBody = req.body as CreateClientBodyType;
    //take the body from the request and call the service
    const clientResult = await createClientService(clientBody);
    //
    res.status(201).json(clientResult);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Failed to create client" });
  }
};

// responseble only for the http request
