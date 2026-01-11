import { getDb } from "../../core/db/mongo";
import { DEMO_FLOW_TEMPLATE } from "./flow.demoFlow";
import { ClientSession } from "mongodb";

const createFlowInDb = async ({
  clientId,
  session,
}: {
  clientId: string;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("flows");
  const flowDoc = {
    clientId,
    ...DEMO_FLOW_TEMPLATE,
  };

  const result = await collection.insertOne(flowDoc, { session });
  return result.insertedId;
};

const updateFlowInDb = async ({
  clientId,
  flowData,
}: {
  clientId: string;
  flowData: {
    flowName: string;
    interactions: Array<{
      id: string;
      type: string;
      name: string;
      text: string;
      position: { x: number; y: number };
      successStatus: string;
      children: string[];
    }>;
  };
}) => {
  const db = getDb();
  const collection = db.collection("flows");
  const flowNewDoc = {
    clientId,
    ...flowData,
  };
  const result = await collection.findOneAndUpdate(
    { clientId: clientId },
    { $set: flowNewDoc },
    { returnDocument: "after" }
  );
  return result;
};

const deleteFlowInDb = async ({
  clientId,
  session,
}: {
  clientId: string;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("flows");
  await collection.deleteOne({ clientId: clientId }, { session });
};

export const flowsMongoService = {
  createFlowInDb,
  updateFlowInDb,
  deleteFlowInDb,
};
