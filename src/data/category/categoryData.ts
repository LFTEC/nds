import { number, z } from "zod";

export const sortableSchema = z.object({
  id: z.number(),
  serialNo: z.number()
});