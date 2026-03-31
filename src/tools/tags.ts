import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getTagsSchema = z.object({});

export async function handleGetTags(_params: z.infer<typeof getTagsSchema>): Promise<string> {
  const result = await kaitenRequest("GET", "tags");
  return JSON.stringify(result, null, 2);
}

export const addTagToCardSchema = z.object({
  card_id: z.number().describe("ID карточки"),
  tag_id: z.number().describe("ID тега"),
});

export async function handleAddTagToCard(params: z.infer<typeof addTagToCardSchema>): Promise<string> {
  const result = await kaitenRequest("POST", `cards/${params.card_id}/tags`, { tag_id: params.tag_id });
  return JSON.stringify(result, null, 2);
}
