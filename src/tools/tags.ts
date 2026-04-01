import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const listTagsSchema = z.object({});

export async function handleListTags(_params: z.infer<typeof listTagsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "tags");
  return JSON.stringify(result, null, 2);
}
