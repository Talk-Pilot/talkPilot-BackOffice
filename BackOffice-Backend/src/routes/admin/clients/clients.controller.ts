//transfer the http request to "code"
// req to body
// call the service
// return the response

import { Request, Response } from "express";
import { CreateClientBodyType, UpdateClientBodyType } from "../../../service/clients/clients.types";
import { getAllClientsService, createClientService ,updateClientByClientIdService} from "../../../service/clients/clients.service";

const createNewClient = async (req: Request, res: Response) => {
  try {
    const clientBody = req.body as CreateClientBodyType;
    //take the body from the request and call the service
    const clientResult = await createClientService(clientBody);

    console.log("clientResult####", clientResult);
    //
    res.status(201).json(clientResult);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Failed to create client" });
  }
};

const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await getAllClientsService();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Failed to get clients" });
  }
};


const updateClientByClientId = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;  
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }
    const clientBody = req.body as UpdateClientBodyType;
    console.log("clientBody####", clientBody);
    const clientResult = await updateClientByClientIdService(clientBody, clientId);
    return res.status(200).json(clientResult);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Failed to update client" });
  }
};
export { createNewClient, getAllClients, updateClientByClientId };
