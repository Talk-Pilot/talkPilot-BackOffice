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
  console.log("clientRecordMongo####", client);
  console.log("resultRecordMongo####", result);
  console.log("result.insertedId####", result.insertedId);
  return result.insertedId;
};

export const clientsMongoService = {
  createClientInDb,
};
