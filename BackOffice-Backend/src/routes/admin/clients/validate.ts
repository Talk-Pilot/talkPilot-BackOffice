import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // im checking here the req.body is valid according to the schema
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }
    // if this ok ==> next
    req.body = result.data;

    next();
  };
