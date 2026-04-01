import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const listCardsSchema = z.object({
  board_id: z.number().optional().describe("Board ID to filter cards"),
  column_id: z.number().optional().describe("Column ID to filter cards"),
  offset: z.number().optional().describe("Pagination offset"),
  limit: z.number().optional().describe("Limit (default 100)"),
});

export async function handleListCards(params: z.infer<typeof listCardsSchema>): Promise<string> {
  const queryParams: Record<string, string> = {};
  if (params.board_id) queryParams.board_id = String(params.board_id);
  if (params.column_id) queryParams.column_id = String(params.column_id);
  if (params.offset) queryParams.offset = String(params.offset);
  if (params.limit) queryParams.limit = String(params.limit);

  const result = await kaitenRequest("GET", "cards", undefined, queryParams);
  return JSON.stringify(result, null, 2);
}

export const getCardSchema = z.object({
  card_id: z.number().describe("Card ID to retrieve"),
});

export async function handleGetCard(params: z.infer<typeof getCardSchema>): Promise<string> {
  const result = await kaitenRequest("GET", `cards/${params.card_id}`);
  return JSON.stringify(result, null, 2);
}

export const createCardSchema = z.object({
  title: z.string().describe("Card title"),
  board_id: z.number().describe("Board ID"),
  column_id: z.number().describe("Column ID"),
  description: z.string().optional().describe("Card description"),
  owner_id: z.number().optional().describe("Card owner user ID"),
});

export async function handleCreateCard(params: z.infer<typeof createCardSchema>): Promise<string> {
  const body: Record<string, unknown> = {
    title: params.title,
    board_id: params.board_id,
    column_id: params.column_id,
  };
  if (params.description) body.description = params.description;
  if (params.owner_id) body.owner_id = params.owner_id;

  const result = await kaitenRequest("POST", "cards", body);
  return JSON.stringify(result, null, 2);
}

export const updateCardSchema = z.object({
  card_id: z.number().describe("Card ID to update"),
  title: z.string().optional().describe("New card title"),
  description: z.string().optional().describe("New card description"),
  owner_id: z.number().optional().describe("New owner user ID"),
});

export async function handleUpdateCard(params: z.infer<typeof updateCardSchema>): Promise<string> {
  const body: Record<string, unknown> = {};
  if (params.title !== undefined) body.title = params.title;
  if (params.description !== undefined) body.description = params.description;
  if (params.owner_id !== undefined) body.owner_id = params.owner_id;

  const result = await kaitenRequest("PATCH", `cards/${params.card_id}`, body);
  return JSON.stringify(result, null, 2);
}

export const moveCardSchema = z.object({
  card_id: z.number().describe("Card ID to move"),
  column_id: z.number().describe("Target column ID"),
});

export async function handleMoveCard(params: z.infer<typeof moveCardSchema>): Promise<string> {
  const result = await kaitenRequest("PATCH", `cards/${params.card_id}`, {
    column_id: params.column_id,
  });
  return JSON.stringify(result, null, 2);
}

export const addCardCommentSchema = z.object({
  card_id: z.number().describe("Card ID to comment on"),
  text: z.string().describe("Comment text"),
});

export async function handleAddCardComment(params: z.infer<typeof addCardCommentSchema>): Promise<string> {
  const result = await kaitenRequest("POST", `cards/${params.card_id}/comments`, {
    text: params.text,
  });
  return JSON.stringify(result, null, 2);
}
