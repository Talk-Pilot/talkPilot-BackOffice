// schema for the request body --  checking input data
import { z } from "zod";

export const createClientBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  phoneNumber: z.array(z.string().min(10)).min(1),
  managedBy: z.string().optional(),
  uid: z.string().optional(),
});

export const updateClientBodySchema = z.object({
  phoneNumber: z.array(z.string().min(10)).min(1).optional(),
  flow: z
    .object({
      // ← במקום flowId, לקבל את כל ה-flow
      flowName: z.string(),
      interactions: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          name: z.string(),
          text: z.string(),
          position: z.object({ x: z.number(), y: z.number() }),
          successStatus: z.string(),
          children: z.array(z.string()),
        })
      ),
    })
    .optional(),
  phoneOperation: z.enum(["replace", "add"]).optional(),
});

// checking that all what will go to "controller" is valid
// mongo have id for himself
// uid is the user id from the firebase authentication

//clinetId ( the user id from the firebase authentication) ==> const { uid: clientId } = userRecord;

//id ( the mongo id) look like "_id": ObjectId("xxxx"),
