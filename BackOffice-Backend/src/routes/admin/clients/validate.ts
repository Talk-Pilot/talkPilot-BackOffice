import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// the function will get any type of zod schema
// in our case it will get the createClientBodySchema (z.object)
// schema = createClientBodySchema || z.ZodTypeAny = z.object({

export const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("validateBody req.body =", req.body);
    const result = schema.safeParse(req.body);
    console.log("result", result);
    console.log("result.data", result.data);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }
    req.body = result.data;
    next();
  };
