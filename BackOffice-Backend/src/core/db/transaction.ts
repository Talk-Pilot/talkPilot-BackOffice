import { ClientSession, TransactionOptions } from "mongodb";
import { getClient } from "./mongo";

export const executeTransaction = async (
  operations: Array<(session: ClientSession) => Promise<any>>
): Promise<any[]> => {
    //get mongo client
  const client = getClient();
  //we start a session
  const session = client.startSession();

  try {
    return await session.withTransaction(async () => {
      const results = [];
      for (const operation of operations) {
        const result = await operation(session);
        results.push(result);
      }
      console.log("results#### in transaction", results);
      return results;
    });
  } finally {
    await session.endSession();
  }
};

