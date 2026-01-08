// get the request body from the controller
//like in the schema

import { firebaseAuthService } from "../../core/auth/firebaseAuthService";
import {
  CreateClientBodyType,
  CreateClientResultType,
  UpdateClientBodyType,
  UpdateClientResultType,
} from "./clients.types";
import { clientsMongoService } from "./clientsMongoService";
import { executeTransaction } from "../../core/db/transaction";
import { createFlowInDb, updateFlowInDb } from "../flows/flow.mongo.service";
import { phoneNumbersMongoService } from "../phoneNumbers/phoneNumbers.mongo.service";

const createClientService = async (
  newClient: CreateClientBodyType
): Promise<CreateClientResultType> => {
  // 1. create user in firebase (must succeed first - outside transaction)
  const clientRecordFirebase = await firebaseAuthService.createUser({
    email: newClient.email,
    password: newClient.password,
  });
  console.log("clientRecordFirebase######", clientRecordFirebase);

  //  Create client, flow, and phone numbeer in transaction
  // "All or nothing approach״

  const [clientMongoId, flowId, phoneIds] = await executeTransaction([
    //executeTransaction return array of results
    //clientMongoId is the first result
    (session) =>
      clientsMongoService.createClientInDb({
        clientId: clientRecordFirebase.uid,
        credits: 0,
        managedBy: newClient.managedBy || "",
        session,
      }),

    (session) =>
      createFlowInDb({
        clientId: clientRecordFirebase.uid,
        session,
      }),
    (session) =>
      phoneNumbersMongoService.createPhoneNumbersInDb({
        clientId: clientRecordFirebase.uid,
        phoneNumber: newClient.phoneNumber,
        session,
      }),
  ]);

  console.log("clientRecordMongo#####", clientMongoId);
  console.log("clientRecordMongo#####", clientMongoId);
  console.log("flowId#####", flowId);
  console.log("phoneIds#####", phoneIds);

  return {
    id: clientMongoId.toString(), // MongoDB ObjectId
    clientId: clientRecordFirebase.uid, // Firebase UID
    credits: 0,
    managedBy: newClient.managedBy || "",
  };
};

const getAllClientsService = async () => {
  const clients = await clientsMongoService.getAllClients();
  return clients;
};

const updateClientByClientIdService = async (
  clientBody: UpdateClientBodyType,
  clientId: string
): Promise<UpdateClientResultType> => {
  let updatedPhoneNumbers = null;
  let updatedFlow = null;

  // i want to check if user put phonenumbers in the body for update
  if (clientBody.phoneNumber) {
    const operation = clientBody.phoneOperation;

    if (operation === "add") {
        updatedPhoneNumbers = await phoneNumbersMongoService.addPhoneNumbersInDb({
        clientId: clientId,
        phoneNumber: clientBody.phoneNumber,
      });
    } else if (operation === "replace") {
      updatedPhoneNumbers =
        await phoneNumbersMongoService.replacePhoneNumbersInDb({
          clientId: clientId,
          phoneNumber: clientBody.phoneNumber,
        });
    }
  }
  // i want to check if user put flow in the body for update
  if (clientBody.flow) {
    updatedFlow = await updateFlowInDb({
      clientId: clientId,
      flowData: clientBody.flow,
    });
  }
  return {
    phoneNumbers: updatedPhoneNumbers,
    flow: updatedFlow,
  };
};

export {
  getAllClientsService,
  createClientService,
  updateClientByClientIdService,
};
