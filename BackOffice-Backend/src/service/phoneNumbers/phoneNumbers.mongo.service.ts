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

  // יצירת מערך של אובייקטים - אחד לכל מספר טלפון
  const phoneNumberDocs = phoneNumber.map((phone) => ({
    clientId,
    phoneNumber: phone,
  }));

  let result;

  if (session) {
    result = await collection.insertMany(phoneNumberDocs, { session });
  } else {
    result = await collection.insertMany(phoneNumberDocs);
  }

  return result.insertedIds;
};

export const phoneNumbersMongoService = {
  createPhoneNumbersInDb,
};