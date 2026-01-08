import { z } from "zod";
import { createClientBodySchema, updateClientBodySchema } from "../../routes/admin/clients/clients.schema";
// import { FlowDocumentType } from "../flows/flows.types";
import { WithId, Document } from "mongodb";


export type CreateClientBodyType = z.infer<typeof createClientBodySchema>;

export type CreateClientResultType = {
  id: string;
  clientId: string;
  managedBy?: string;
  credits: number;
};

export type UpdateClientBodyType = z.infer<typeof updateClientBodySchema>;

export type UpdateClientResultType = {
  phoneNumbers?: WithId<Document> | null;
  flow?: WithId<Document> | null;  
};