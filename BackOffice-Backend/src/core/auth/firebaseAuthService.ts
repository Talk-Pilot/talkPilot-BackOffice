// create user in firebase auth

import admin from "../../core/auth/firebase";

export const firebaseAuthService = {
  createUser: async ({
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
    console.log("userRecord#####", userRecord);
    return userRecord;
  },
};
