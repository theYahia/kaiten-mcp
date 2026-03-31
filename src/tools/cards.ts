import { z } from "zod";
import { kaitenRequest } from "../client.js";

export const getCardsSchema = z.object({
  board_id: z.number().optional().describe("ID доски для фильтрации карточек"),
  column_id: z.number().optional().describe("ID колонки для фильтрации карточек"),
  offset: z.number().optional().describe("Смещение для пагинации"),
  limit: z.number().optional().describe("Лимит карточек (по умолчанию 100)"),
});

export async function handleGetCards(params: z.infer<typeof getCardsSchema>): Promise<string> {
  const queryParams: Record<string, string> = {};
  if (params.board_id) queryParams.board_id = String(params.board_id);
  if (params.column_id) queryParams.column_id = String(params.column_id);
  if (params.offset) queryParams.offset = String(params.offset);
  if (params.limit) queryParams.limit = String(params.limit);

  const result = await kaitenRequest("GET", "cards", undefined, queryParams);
  return JSON.stringify(result, null, 2);
}

export const getCardSchema = z.object({
  card_id: z.number().describe("ID карточки"),
});

export async function handleGetCard(params: z.infer<typeof getCardSchema>): Promise<string> {
  const result = await kaitenRequest("GET", `cards/${params.card_id}`);
  return JSON.stringify(result, null, 2);
}

export const createCardSchema = z.object({
  title: z.string().describe("Название карточки"),
  board_id: z.number().describe("ID доски"),
  column_id: z.number().describe("ID колонки"),
  description: z.string().optional().describe("Описание карточки"),
  owner_id: z.number().optional().describe("ID владельца карточки"),
  lane_id: z.number().optional().describe("ID горизонтальной дорожки"),
  tags: z.array(z.number()).optional().describe("Массив ID тегов"),
});

export async function handleCreateCard(params: z.infer<typeof createCardSchema>): Promise<string> {
  const body: Record<string, unknown> = {
    title: params.title,
    board_id: params.board_id,
    column_id: params.column_id,
  };
  if (params.description) body.description = params.description;
  if (params.owner_id) body.owner_id = params.owner_id;
  if (params.lane_id) body.lane_id = params.lane_id;
  if (params.tags) body.tag_ids = params.tags;

  const result = await kaitenRequest("POST", "cards", body);
  return JSON.stringify(result, null, 2);
}

export const updateCardSchema = z.object({
  card_id: z.number().describe("ID карточки"),
  title: z.string().optional().describe("Новое название"),
  description: z.string().optional().describe("Новое описание"),
  column_id: z.number().optional().describe("ID новой колонки (перемещение)"),
  owner_id: z.number().optional().describe("ID нового владельца"),
});

export async function handleUpdateCard(params: z.infer<typeof updateCardSchema>): Promise<string> {
  const { card_id, ...fields } = params;
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) body[k] = v;
  }
  const result = await kaitenRequest("PATCH", `cards/${card_id}`, body);
  return JSON.stringify(result, null, 2);
}
