import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

process.env.KAITEN_DOMAIN = "testdomain";
process.env.KAITEN_TOKEN = "test-token-123";

describe("kaiten-mcp tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
      text: () => Promise.resolve("[]"),
    });
  });

  describe("boards", () => {
    it("handleListBoards calls GET boards", async () => {
      const { handleListBoards } = await import("../tools/boards.js");
      await handleListBoards({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/api/latest/boards");
      expect(mockFetch.mock.calls[0][1]?.method).toBe("GET");
    });

    it("handleListColumns calls GET boards/:id/columns", async () => {
      const { handleListColumns } = await import("../tools/boards.js");
      await handleListColumns({ board_id: 5 });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/boards/5/columns");
    });
  });

  describe("cards", () => {
    it("handleListCards calls GET cards", async () => {
      const { handleListCards } = await import("../tools/cards.js");
      await handleListCards({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/api/latest/cards");
    });

    it("handleGetCard calls GET cards/:id", async () => {
      const { handleGetCard } = await import("../tools/cards.js");
      await handleGetCard({ card_id: 42 });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/cards/42");
    });

    it("handleCreateCard sends POST with body", async () => {
      const { handleCreateCard } = await import("../tools/cards.js");
      await handleCreateCard({ title: "Test", board_id: 1, column_id: 2 });
      expect(mockFetch.mock.calls[0][1]?.method).toBe("POST");
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.title).toBe("Test");
      expect(body.board_id).toBe(1);
    });

    it("handleUpdateCard sends PATCH", async () => {
      const { handleUpdateCard } = await import("../tools/cards.js");
      await handleUpdateCard({ card_id: 10, title: "Updated" });
      expect(mockFetch.mock.calls[0][1]?.method).toBe("PATCH");
    });

    it("handleMoveCard sends column_id via PATCH", async () => {
      const { handleMoveCard } = await import("../tools/cards.js");
      await handleMoveCard({ card_id: 10, column_id: 3 });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.column_id).toBe(3);
    });

    it("handleAddCardComment sends POST to card comments", async () => {
      const { handleAddCardComment } = await import("../tools/cards.js");
      await handleAddCardComment({ card_id: 10, text: "Nice work" });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/cards/10/comments");
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.text).toBe("Nice work");
    });
  });

  describe("tags", () => {
    it("handleListTags calls GET tags", async () => {
      const { handleListTags } = await import("../tools/tags.js");
      await handleListTags({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("/tags");
    });
  });

  describe("error handling", () => {
    it("throws on missing KAITEN_DOMAIN", async () => {
      const orig = process.env.KAITEN_DOMAIN;
      delete process.env.KAITEN_DOMAIN;
      const { kaitenRequest } = await import("../client.js");
      await expect(kaitenRequest("GET", "test")).rejects.toThrow("KAITEN_DOMAIN");
      process.env.KAITEN_DOMAIN = orig;
    });
  });
});
