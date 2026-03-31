#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCardsSchema, handleGetCards, createCardSchema, handleCreateCard } from "./tools/cards.js";
import { getBoardsSchema, handleGetBoards } from "./tools/boards.js";

const server = new McpServer({
  name: "kaiten-mcp",
  version: "1.0.0",
});

server.tool(
  "get_cards",
  "Получить список карточек Kaiten с фильтрацией по доске и колонке.",
  getCardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCards(params) }] }),
);

server.tool(
  "create_card",
  "Создать новую карточку в Kaiten на указанной доске и колонке.",
  createCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateCard(params) }] }),
);

server.tool(
  "get_boards",
  "Получить список досок Kaiten.",
  getBoardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetBoards(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[kaiten-mcp] Сервер запущен. 3 инструмента. Требуется KAITEN_DOMAIN + KAITEN_TOKEN.");
}

main().catch((error) => {
  console.error("[kaiten-mcp] Ошибка:", error);
  process.exit(1);
});
