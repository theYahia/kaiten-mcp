import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getBoardsSchema = z.object({});

export async function handleGetBoards(_params: z.infer<typeof getBoardsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "boards");
  return JSON.stringify(result, null, 2);
}
