import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const listBoardsSchema = z.object({});

export async function handleListBoards(_params: z.infer<typeof listBoardsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "boards");
  return JSON.stringify(result, null, 2);
}

export const listColumnsSchema = z.object({
  board_id: z.number().describe("Board ID"),
});

export async function handleListColumns(params: z.infer<typeof listColumnsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", `boards/${params.board_id}/columns`);
  return JSON.stringify(result, null, 2);
}
