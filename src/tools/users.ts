import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const listUsersSchema = z.object({});

export async function handleListUsers(_params: z.infer<typeof listUsersSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "users");
  return JSON.stringify(result, null, 2);
}
