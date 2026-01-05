// get the request body from the controller
//like in the schema

import { firebaseAuthService } from "../../../core/auth/firebaseAuthService";
import { CreateClientBodyType, CreateClientResultType } from "./clients.types";
import { clientsMongoService } from "./mongo/clientsMongoService";

export const createClientService = async (
  client: CreateClientBodyType
): Promise<CreateClientResultType> => {
  // create user in firebase
  const clientRecordFirebase = await firebaseAuthService.createUser({
    email: client.email,
    password: client.password,
  });
  console.log("clientRecordFirebase######", clientRecordFirebase);

  // 2. יוצרים רשומה ב-MongoDB
  const clientRecordMongo = await clientsMongoService.createClientInDb({
    clientId: clientRecordFirebase.uid,
  });
  console.log("clientRecordMongo#####", clientRecordMongo);

  return {
    id: clientRecordMongo.toString(), // MongoDB ObjectId (מומר ל-string)
    clientId: clientRecordFirebase.uid, // Firebase UID
    email: client.email,
  };
};
