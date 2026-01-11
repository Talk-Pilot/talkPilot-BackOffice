// create user in firebase auth

import admin from "../../core/auth/firebase";

export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });
  // Add admin claim automatically
  await setAdmin(userRecord.uid);
  console.log("userRecord#####", userRecord);
  return userRecord;
};

export const deleteUserByUid = async (uid: string) => {
  await admin.auth().deleteUser(uid);
};

export const setAdmin = async (uid: string) => {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
};
