// get the request body from the controller
//like in the schema

import {
  createUser,
  deleteUserByUid,
} from "../../core/auth/firebaseAuthService";
import {
  CreateClientBodyType,
  CreateClientResultType,
  UpdateClientBodyType,
  UpdateClientResultType,
} from "./clients.types";
import { clientsMongoService } from "./clientsMongoService";
import { executeTransaction } from "../../core/db/transaction";
import { flowsMongoService } from "../flows/flow.mongo.service";
import { phoneNumbersMongoService } from "../phoneNumbers/phoneNumbers.mongo.service";
import { sessionsMongoService } from "../sessions/sessions.mongo.servise";
import { callsMongoService } from "../calls/calls.mongo.servise";

const createClientService = async (
  newClient: CreateClientBodyType
): Promise<CreateClientResultType> => {
  // 1. create user in firebase (must succeed first - outside transaction)
  const clientRecordFirebase = await createUser({
    email: newClient.email,
    password: newClient.password,
  });
  console.log("clientRecordFirebase######", clientRecordFirebase);

  //  Create client, flow, and phone numbeer in transaction
  // "All or nothing approach״

  const [clientMongoId] = await executeTransaction([
    //executeTransaction return array of results
    //clientMongoId is the first result
    (session) =>
      clientsMongoService.createClientInDb({
        clientId: clientRecordFirebase.uid,
        credits: 1000000,
        managedBy: newClient.managedBy || "",
        session,
      }),
    (session) =>
      flowsMongoService.createFlowInDb({
        session,
      }),
    (session, previousResults) =>
      phoneNumbersMongoService.createPhoneNumbersInDb({
        clientId: clientRecordFirebase.uid,
        phoneNumber: newClient.phoneNumber,
        flowId: previousResults?.[1],
        session,
      }),
  ]);

  return {
    id: clientMongoId.toString(), // MongoDB ObjectId
    clientId: clientRecordFirebase.uid, // Firebase UID
    credits: 1000000,
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
    updatedFlow = await flowsMongoService.updateFlowInDb({
      clientId: clientId,
      flowData: clientBody.flow,
    });
  }
  return {
    phoneNumbers: updatedPhoneNumbers,
    flow: updatedFlow,
  };
};

const deleteClientByClientIdService = async (clientId: string) => {
  // All MongoDB deletions in transaction (All or nothing)
  await executeTransaction([
    (session) => clientsMongoService.deleteClientInDb({ clientId, session }),
    (session) =>
      phoneNumbersMongoService.deletePhoneNumbersInDb({ clientId, session }),
    (session) => flowsMongoService.deleteFlowInDb({ clientId, session }),
    (session) => sessionsMongoService.deleteSessionByID({ clientId, session }),
    (session) => callsMongoService.deleteResultByID({ clientId, session }),
  ]);

  // Firebase delete outside transaction (can't be in MongoDB transaction)
  await deleteUserByUid(clientId);
};

export {
  getAllClientsService,
  createClientService,
  updateClientByClientIdService,
  deleteClientByClientIdService,
};
