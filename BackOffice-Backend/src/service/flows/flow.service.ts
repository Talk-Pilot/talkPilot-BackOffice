import { getDb } from "../../core/db/mongo";
import { DEMO_FLOW_TEMPLATE } from "./flow.demoFlow";
import { ClientSession } from "mongodb";

export const createFlowInDb = async ({
  clientId,
  session,
}: {
  clientId: string;
  session?: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("flows");
  const flowDoc = {
    clientId,
    ...DEMO_FLOW_TEMPLATE,
  };

  let result;

  if (session) {
    result = await collection.insertOne(flowDoc, { session: session });
  } else {
    result = await collection.insertOne(flowDoc);
  }
  return result.insertedId;
};
