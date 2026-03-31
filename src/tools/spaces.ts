import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getSpacesSchema = z.object({});

export async function handleGetSpaces(_params: z.infer<typeof getSpacesSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "spaces");
  return JSON.stringify(result, null, 2);
}

export const getSpaceSchema = z.object({
  space_id: z.number().describe("ID пространства"),
});

export async function handleGetSpace(params: z.infer<typeof getSpaceSchema>): Promise<string> {
  const result = await kaitenRequest("GET", `spaces/${params.space_id}`);
  return JSON.stringify(result, null, 2);
}
