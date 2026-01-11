import { getDb } from "../../core/db/mongo";
import { ClientSession } from "mongodb";

const deleteResultByID = async ({
  clientId,
  session,
}: {
  clientId: string;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("results");
  await collection.deleteOne({ clientId: clientId }, { session });
};

export const callsMongoService = {
  deleteResultByID,
};
