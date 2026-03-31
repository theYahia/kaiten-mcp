import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getColumnsSchema = z.object({
  board_id: z.number().describe("ID доски для получения колонок"),
});

export async function handleGetColumns(params: z.infer<typeof getColumnsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", `boards/${params.board_id}/columns`);
  return JSON.stringify(result, null, 2);
}
