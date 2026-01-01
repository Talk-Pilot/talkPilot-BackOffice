import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { config } from "../core/config";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // note to myself - we get headers object express create it as req ==> req.head
  console.log("🔥 adminAuth middleware hit");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // note to myself - we use Constant-time comparison
  // to avoid check in time based on the length of the token
  //to compare they have to be the same length!!
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenFromRequest = parts[1];

  if (!tokenFromRequest) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const expectedToken = config.adminToken;

  const tokenBuffer = Buffer.from(tokenFromRequest);
  const expectedBuffer = Buffer.from(expectedToken);

  //to compare they have to be the same length!!
  if (
    tokenBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};


