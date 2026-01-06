import { getDb } from "../../core/db/mongo";
import { ClientSession } from "mongodb";

const createPhoneNumbersInDb = async ({
  phoneNumber,
  clientId,
  session,
}: {
  phoneNumber: string[];
  clientId: string;
  session?: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");

  const phoneNumberDocs = phoneNumber.map((phoneItem) => {
    // how the single phone document looks like in mongo db
    const singlePhoneDocument = {
      clientId: clientId,
      phoneNumber: phoneItem,
    };

    return singlePhoneDocument;
  });
  console.log("phoneNumberDocs####", phoneNumberDocs);

  let result;

  if (session) {
    result = await collection.insertMany(phoneNumberDocs, { session });
  } else {
    result = await collection.insertMany(phoneNumberDocs);
  }
  console.log("result####", result);
  console.log("session####", session);
  console.log("result.insertedIds####", result.insertedIds);
  return result.insertedIds;
};

export const phoneNumbersMongoService = {
  createPhoneNumbersInDb,
};
