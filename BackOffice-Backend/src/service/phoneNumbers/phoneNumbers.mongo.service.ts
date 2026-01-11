import { getDb } from "../../core/db/mongo";
import { ClientSession, ObjectId, ReturnDocument } from "mongodb";

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
  flowId,
}: {
  phoneNumber: string[];
  clientId: string;
  flowId: ObjectId;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");

  const phoneNumberDocs = phoneNumber.map((phoneItem) => {
    const singlePhoneDocument = {
      clientId: clientId,
      phoneNumber: convertPhoneNumberFormat(phoneItem),
      flowId: flowId,
    };

    return singlePhoneDocument;
  });
  console.log("phoneNumberDocs####", phoneNumberDocs);
  const result = await collection.insertMany(phoneNumberDocs, { session });

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
    { returnDocument: "after" }
  );
  return result;
};

const getPhoneNumbersByClientId = async (clientId: string) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");
  const result = await collection.findOne({ clientId: clientId });
  return result;
};

const addPhoneNumbersInDb = async ({
  clientId,
  phoneNumber,
}: {
  clientId: string;
  phoneNumber: string[];
}) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");

  const existing = await collection.findOne({ clientId: clientId });

  const convertedPhones = phoneNumber.map((phone) =>
    convertPhoneNumberFormat(phone)
  );

  const updatedPhones = [...(existing?.phone_number || []), ...convertedPhones];

  const result = await collection.findOneAndUpdate(
    { clientId: clientId },
    { $set: { phone_number: updatedPhones } },
    { returnDocument: "after", upsert: true }
  );

  return result;
};
const deletePhoneNumbersInDb = async ({
  clientId,
  session,
}: {
  clientId: string;
  session: ClientSession;
}) => {
  const db = getDb();
  const collection = db.collection("phone_numbers");
  await collection.deleteOne({ clientId: clientId }, { session });
};

export const phoneNumbersMongoService = {
  createPhoneNumbersInDb,
  convertPhoneNumberFormat,
  replacePhoneNumbersInDb,
  getPhoneNumbersByClientId,
  addPhoneNumbersInDb,
  deletePhoneNumbersInDb,
};
