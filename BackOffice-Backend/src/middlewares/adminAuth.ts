import { Request, Response, NextFunction } from "express";
import { config } from "../core/config";
import admin from "firebase-admin";

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // note to myself - we get headers object express create it as req ==> req.head
  console.log("adminAuth hit", req.method, req.path);
  console.log("adminAuth middleware hit");

  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const authParts = authHeader.split(" ");
    if (authParts.length !== 2 || authParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authParts[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    console.log("decodedToken.uid:", decodedToken.uid);
    console.log("config.adminUid:", config.adminUid);
    if (decodedToken.uid !== config.adminUid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.headers["x-clientid"] = decodedToken.uid;
    console.log("adminAuth middleware passed");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // note to myself - we use Constant-time comparison
  // to avoid check in time based on the length of the token
  //to compare they have to be the same length!!
};
