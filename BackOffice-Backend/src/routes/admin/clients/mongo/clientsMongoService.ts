// create connection to db
//work with the specific collection
// create a client record
// get client id from the record

import { connectToMongo } from "../../../../core/db/mongo";

const createClientInDb = async ({ clientId }: { clientId: string }) => {
  const db = await connectToMongo();
  const collection = db.collection("clients");
  const client = {
    clientId,
  };
  const result = await collection.insertOne(client);
  // insert the object (from front ) and put it the db
  console.log("clientRecordMongo####", client);
  console.log("resultRecordMongo####", result);
  console.log("result.insertedId####", result.insertedId);
  return result.insertedId;
};

export const clientsMongoService = {
  createClientInDb,
};

//  const getClientIdFromDb = async (client: CreateClientBodyType) => {
//     const db = await connectToMongo();
//     const collection = db.collection("clients");
//     const result = await collection.findOne({ email: client.email });
//     return result?.id;
//  }
