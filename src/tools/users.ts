import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getUsersSchema = z.object({});

export async function handleGetUsers(_params: z.infer<typeof getUsersSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "users");
  return JSON.stringify(result, null, 2);
}

export const getCurrentUserSchema = z.object({});

export async function handleGetCurrentUser(_params: z.infer<typeof getCurrentUserSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "users/current");
  return JSON.stringify(result, null, 2);
}
