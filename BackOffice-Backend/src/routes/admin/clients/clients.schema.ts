import { z } from "zod";

export const createClientBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
});
