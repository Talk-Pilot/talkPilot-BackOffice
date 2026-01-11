import { getDb } from "../../core/db/mongo";
import { ClientSession } from "mongodb";

const deleteSessionByID = async ({
  clientId,
  session,
}: {
  clientId: string;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("sessions");
  await collection.deleteOne({ clientId: clientId }, { session });
};


export const sessionsMongoService = {
  deleteSessionByID,
};