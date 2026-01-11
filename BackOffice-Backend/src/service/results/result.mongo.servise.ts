import { ClientSession } from "mongodb";
import { getDb } from "../../core/db/mongo";

const deleteResultByID = async ({
  clientId,
  session,
}: {
  clientId: string;
  session?: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("calls");
  if (session) {
    await collection.deleteOne({ clientId: clientId }, { session });
  } else {
    await collection.deleteOne({ clientId: clientId });
  }
};

export const resultsMongoService = {
  deleteResultByID,
};
