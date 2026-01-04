import { z } from "zod";
import { createClientBodySchema } from "./clients.schema";

export type CreateClientBodyType = z.infer<
  typeof createClientBodySchema
>;


export type CreateClientResultType = {
  id: string;        
  clientId: string;  
  email: string;
  managedBy?: string;
};
