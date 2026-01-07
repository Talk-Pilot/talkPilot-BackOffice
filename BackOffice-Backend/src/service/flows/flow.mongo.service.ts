import { getDb } from "../../core/db/mongo";
import { DEMO_FLOW_TEMPLATE } from "./flow.demoFlow";
import { ClientSession } from "mongodb";

 const createFlowInDb = async ({
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
    { returnDocument: 'after' }
  );
  return result;
};
export { createFlowInDb, updateFlowInDb };