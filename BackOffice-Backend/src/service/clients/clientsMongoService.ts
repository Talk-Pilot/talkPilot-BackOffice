// create connection to db
//work with the specific collection
// create a client record
// get client id from the record

import { getDb } from "../../core/db/mongo";
import { ClientSession } from "mongodb";

const createClientInDb = async ({
  clientId,
  managedBy,
  session,
  credits,
}: {
  clientId: string;
  managedBy: string;
  credits: number;
  session?: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("clients");
  const client = {
    clientId,
    managedBy,
    credits,
  };
  let result;
  if (session) {
    result = await collection.insertOne(client, { session });
  } else {
    result = await collection.insertOne(client);
  }
  // insert the object (from front ) and put it the db
  return result.insertedId;
};

const getAllClients = async () => {
  const db = getDb();
  const collection = db.collection("clients");
  const clients = await collection.find().toArray();
  console.log("clients", clients);
  return clients;
};

const deleteClientInDb = async (clientId: string) => {
  const db = getDb();
  const collection = db.collection("clients");
  await collection.deleteOne({ clientId: clientId });
};

export const clientsMongoService = {
  createClientInDb,
  getAllClients,
  deleteClientInDb,
};
