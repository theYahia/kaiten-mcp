#!/usr/bin/env node

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCardsSchema, handleGetCards, getCardSchema, handleGetCard, createCardSchema, handleCreateCard, updateCardSchema, handleUpdateCard } from "./tools/cards.js";
import { getBoardsSchema, handleGetBoards } from "./tools/boards.js";
import { getColumnsSchema, handleGetColumns } from "./tools/columns.js";
import { getTagsSchema, handleGetTags, addTagToCardSchema, handleAddTagToCard } from "./tools/tags.js";
import { getUsersSchema, handleGetUsers, getCurrentUserSchema, handleGetCurrentUser } from "./tools/users.js";
import { getSpacesSchema, handleGetSpaces, getSpaceSchema, handleGetSpace } from "./tools/spaces.js";

const VERSION = "1.1.0";
const TOOL_COUNT = 12;

const server = new McpServer({
  name: "kaiten-mcp",
  version: VERSION,
});

// --- Cards (4) ---
server.tool(
  "get_cards",
  "Получить список карточек Kaiten с фильтрацией по доске и колонке.",
  getCardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCards(params) }] }),
);

server.tool(
  "get_card",
  "Получить одну карточку по ID.",
  getCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCard(params) }] }),
);

server.tool(
  "create_card",
  "Создать новую карточку в Kaiten на указанной доске и колонке.",
  createCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateCard(params) }] }),
);

server.tool(
  "update_card",
  "Обновить карточку: название, описание, колонку, владельца.",
  updateCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleUpdateCard(params) }] }),
);

// --- Boards (1) ---
server.tool(
  "get_boards",
  "Получить список досок Kaiten.",
  getBoardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetBoards(params) }] }),
);

// --- Columns (1) ---
server.tool(
  "get_columns",
  "Получить колонки доски по board_id.",
  getColumnsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetColumns(params) }] }),
);

// --- Tags (2) ---
server.tool(
  "get_tags",
  "Получить все теги пространства.",
  getTagsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetTags(params) }] }),
);

server.tool(
  "add_tag_to_card",
  "Добавить тег к карточке.",
  addTagToCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleAddTagToCard(params) }] }),
);

// --- Users (2) ---
server.tool(
  "get_users",
  "Получить список пользователей.",
  getUsersSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetUsers(params) }] }),
);

server.tool(
  "get_current_user",
  "Получить текущего пользователя (владельца токена).",
  getCurrentUserSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCurrentUser(params) }] }),
);

// --- Spaces (2) ---
server.tool(
  "get_spaces",
  "Получить список пространств.",
  getSpacesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetSpaces(params) }] }),
);

server.tool(
  "get_space",
  "Получить пространство по ID с досками.",
  getSpaceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetSpace(params) }] }),
);

// --- Skills (prompts) ---
server.prompt(
  "skill-my-cards",
  "Мои карточки на доске — показать все карточки текущего пользователя",
  async () => ({
    messages: [{
      role: "user" as const,
      content: {
        type: "text" as const,
        text: `Выполни по порядку:
1. Вызови get_current_user, запомни мой user id.
2. Вызови get_boards, покажи список досок.
3. Для каждой доски вызови get_cards.
4. Отфильтруй карточки где owner.id === мой user id.
5. Сгруппируй по доскам и выведи в формате:

## Мои карточки

### Доска: <название>
- [<id>] <title> — колонка <column_id>
...

Итого: N карточек на M досках.`,
      },
    }],
  }),
);

server.prompt(
  "skill-create-card",
  "Создай карточку — интерактивное создание с выбором доски и колонки",
  { title: z.string().optional().describe("Название карточки (необязательно, спросит если не указано)") },
  async ({ title }) => ({
    messages: [{
      role: "user" as const,
      content: {
        type: "text" as const,
        text: `Помоги создать карточку в Kaiten. ${title ? `Название: "${title}".` : ""}

Выполни по порядку:
1. Вызови get_spaces, покажи список пространств.
2. Вызови get_boards, покажи список досок.
3. Спроси пользователя какую доску выбрать (по номеру).
4. Вызови get_columns для выбранной доски, покажи колонки.
5. Спроси пользователя какую колонку выбрать.
${title ? "" : "6. Спроси название карточки."}
7. Спроси описание (необязательно).
8. Вызови create_card и покажи результат.

Формат результата:
Карточка создана: [<id>] "<title>" на доске "<board>" в колонке "<column>".`,
      },
    }],
  }),
);

// --- Transport ---
async function main() {
  const args = process.argv.slice(2);
  const httpMode = args.includes("--http");
  const portIdx = args.indexOf("--port");
  const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 3001;

  if (httpMode) {
    const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
    const http = await import("node:http");

    const httpServer = http.createServer(async (req, res) => {
      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
          "Access-Control-Expose-Headers": "Mcp-Session-Id",
        });
        res.end();
        return;
      }

      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
      await server.connect(transport);
      await transport.handleRequest(req, res);
    });

    httpServer.listen(port, () => {
      console.error(`[kaiten-mcp] HTTP-сервер запущен на порту ${port}. ${TOOL_COUNT} инструментов.`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[kaiten-mcp] Сервер запущен (stdio). ${TOOL_COUNT} инструментов, 2 скилла. Требуется KAITEN_TOKEN.`);
  }
}

main().catch((error) => {
  console.error("[kaiten-mcp] Ошибка:", error);
  process.exit(1);
});
