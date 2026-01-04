import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateBody =
  // the function will get any type of zod schema
  // in our case it will get the createClientBodySchema (z.object)
  // schema = createClientBodySchema || z.ZodTypeAny = z.object({
  (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
      console.log("validateBody req.body =", req.body);
      const result = schema.safeParse(req.body);
      console.log(result);
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
