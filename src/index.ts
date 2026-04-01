#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listCardsSchema, handleListCards, getCardSchema, handleGetCard, createCardSchema, handleCreateCard, updateCardSchema, handleUpdateCard, moveCardSchema, handleMoveCard, addCardCommentSchema, handleAddCardComment } from "./tools/cards.js";
import { listBoardsSchema, handleListBoards, listColumnsSchema, handleListColumns } from "./tools/boards.js";
import { listTagsSchema, handleListTags } from "./tools/tags.js";
import { listUsersSchema, handleListUsers } from "./tools/users.js";

const server = new McpServer({
  name: "kaiten-mcp",
  version: "2.0.0",
});

server.tool(
  "list_boards",
  "List all boards in Kaiten workspace.",
  listBoardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListBoards(params) }] }),
);

server.tool(
  "list_columns",
  "List all columns (lanes) of a Kaiten board.",
  listColumnsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListColumns(params) }] }),
);

server.tool(
  "list_cards",
  "List cards with optional filters by board and column.",
  listCardsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListCards(params) }] }),
);

server.tool(
  "get_card",
  "Get a single card by ID with all details.",
  getCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCard(params) }] }),
);

server.tool(
  "create_card",
  "Create a new card on a board in a specific column.",
  createCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateCard(params) }] }),
);

server.tool(
  "update_card",
  "Update card fields: title, description, owner.",
  updateCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleUpdateCard(params) }] }),
);

server.tool(
  "move_card",
  "Move a card to a different column.",
  moveCardSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleMoveCard(params) }] }),
);

server.tool(
  "add_comment",
  "Add a comment to a Kaiten card.",
  addCardCommentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleAddCardComment(params) }] }),
);

server.tool(
  "list_tags",
  "List all tags in the Kaiten workspace.",
  listTagsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListTags(params) }] }),
);

server.tool(
  "list_users",
  "List all users in the Kaiten workspace.",
  listUsersSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListUsers(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[kaiten-mcp] Server started. 10 tools available.");
}

main().catch((error) => {
  console.error("[kaiten-mcp] Error:", error);
  process.exit(1);
});
