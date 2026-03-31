import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleGetBoards } from "../tools/boards.js";
import { handleGetCards, handleCreateCard, handleUpdateCard } from "../tools/cards.js";
import { handleGetColumns } from "../tools/columns.js";
import { handleGetTags } from "../tools/tags.js";
import { handleGetUsers, handleGetCurrentUser } from "../tools/users.js";
import { handleGetSpaces } from "../tools/spaces.js";

function mockFetch(data: unknown) {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(data), { status: 200 }),
  );
}

describe("tools", () => {
  const orig = process.env;

  beforeEach(() => {
    process.env = { ...orig, KAITEN_TOKEN: "tok", KAITEN_DOMAIN: "t" };
  });
  afterEach(() => {
    process.env = orig;
    vi.restoreAllMocks();
  });

  it("get_boards returns JSON", async () => {
    const boards = [{ id: 1, title: "Dev" }];
    mockFetch(boards);
    const result = await handleGetBoards({});
    expect(JSON.parse(result)).toEqual(boards);
  });

  it("get_cards passes query params", async () => {
    mockFetch([]);
    await handleGetCards({ board_id: 5 });
    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("board_id=5");
  });

  it("create_card sends body", async () => {
    mockFetch({ id: 42, title: "New" });
    const result = await handleCreateCard({ title: "New", board_id: 1, column_id: 2 });
    expect(JSON.parse(result).id).toBe(42);
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);
    expect(body.title).toBe("New");
  });

  it("update_card sends PATCH", async () => {
    mockFetch({ id: 1, title: "Updated" });
    await handleUpdateCard({ card_id: 1, title: "Updated" });
    expect(vi.mocked(fetch).mock.calls[0][1]?.method).toBe("PATCH");
  });

  it("get_columns uses board_id in path", async () => {
    mockFetch([]);
    await handleGetColumns({ board_id: 10 });
    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("boards/10/columns");
  });

  it("get_tags returns tags", async () => {
    mockFetch([{ id: 1, name: "bug" }]);
    const result = await handleGetTags({});
    expect(JSON.parse(result)[0].name).toBe("bug");
  });

  it("get_users returns users", async () => {
    mockFetch([{ id: 1, full_name: "Ivan" }]);
    const result = await handleGetUsers({});
    expect(JSON.parse(result)[0].full_name).toBe("Ivan");
  });

  it("get_current_user calls users/current", async () => {
    mockFetch({ id: 1, full_name: "Me" });
    await handleGetCurrentUser({});
    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("users/current");
  });

  it("get_spaces returns spaces", async () => {
    mockFetch([{ id: 1, title: "Main" }]);
    const result = await handleGetSpaces({});
    expect(JSON.parse(result)[0].title).toBe("Main");
  });
});
