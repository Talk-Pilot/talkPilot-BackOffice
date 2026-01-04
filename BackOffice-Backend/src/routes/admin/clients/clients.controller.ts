//transfer the http request to "code"
// req to body
// call the service
// return the response

import { Request, Response } from "express";
import { CreateClientBodyType } from "./clients.types";

export const createNewClient = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateClientBodyType;
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Failed to create client" });
  }
};

// responseble only for the http request
