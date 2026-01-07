import { getDb } from "../../core/db/mongo";
import { ClientSession, ReturnDocument } from "mongodb";

const convertPhoneNumberFormat = (phoneNumber: string) => {
  // if admin will wrote phone number with ==972
  //i dont need that function
  //  its edge case
  const cleanedPhoneNumber = phoneNumber.replace(/ /g, "");
  if (cleanedPhoneNumber.startsWith("0")) {
    return `+972${cleanedPhoneNumber.substring(1)}`;
  }
  return cleanedPhoneNumber;
};

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
      phoneNumber: convertPhoneNumberFormat(phoneItem),
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

const replacePhoneNumbersInDb = async ({
  clientId,
  phoneNumber,
}: {
  clientId: string;
  phoneNumber: string[];
  session?: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");
  const convertedPhones = phoneNumber.map((phone) =>
    convertPhoneNumberFormat(phone)
  );
  const result = await collection.findOneAndUpdate(
    { clientId: clientId },
    { $set: { phone_number: convertedPhones } },
    { returnDocument: 'after' }
  );
  return result;
};

const getPhoneNumbersByClientId = async (clientId: string) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");
  const result = await collection.findOne({ clientId: clientId });
  return result;
};

export const phoneNumbersMongoService = {
  createPhoneNumbersInDb,
  convertPhoneNumberFormat,
  replacePhoneNumbersInDb,
  getPhoneNumbersByClientId,
};
