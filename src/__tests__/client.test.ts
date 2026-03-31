import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBaseUrl, kaitenRequest } from "../client.js";

describe("getBaseUrl", () => {
  const orig = process.env;

  beforeEach(() => {
    process.env = { ...orig };
  });
  afterEach(() => {
    process.env = orig;
  });

  it("returns domain-based URL when KAITEN_DOMAIN is set", () => {
    process.env.KAITEN_DOMAIN = "acme";
    expect(getBaseUrl()).toBe("https://acme.kaiten.ru/api/latest");
  });

  it("returns mykaiten.ru fallback when KAITEN_DOMAIN is empty", () => {
    delete process.env.KAITEN_DOMAIN;
    expect(getBaseUrl()).toBe("https://mykaiten.ru/api/latest");
  });
});

describe("kaitenRequest", () => {
  const orig = process.env;

  beforeEach(() => {
    process.env = { ...orig, KAITEN_TOKEN: "test-token", KAITEN_DOMAIN: "test" };
  });
  afterEach(() => {
    process.env = orig;
    vi.restoreAllMocks();
  });

  it("throws when KAITEN_TOKEN is not set", async () => {
    delete process.env.KAITEN_TOKEN;
    await expect(kaitenRequest("GET", "boards")).rejects.toThrow("KAITEN_TOKEN не задан");
  });

  it("sends Bearer token and parses JSON response", async () => {
    const mockData = [{ id: 1, title: "Board" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200, headers: { "Content-Type": "application/json" } }),
    );

    const result = await kaitenRequest("GET", "boards");
    expect(result).toEqual(mockData);

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[0]).toBe("https://test.kaiten.ru/api/latest/boards");
    expect((call[1]?.headers as Record<string, string>)["Authorization"]).toBe("Bearer test-token");
  });

  it("appends query params for GET requests", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("[]", { status: 200 }),
    );

    await kaitenRequest("GET", "cards", undefined, { board_id: "5" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[0]).toContain("?board_id=5");
  });

  it("sends JSON body for POST requests", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response('{"id":1}', { status: 200 }),
    );

    await kaitenRequest("POST", "cards", { title: "Test" });
    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[1]?.method).toBe("POST");
    expect(call[1]?.body).toBe('{"title":"Test"}');
  });

  it("throws on 4xx errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Not Found", { status: 404, statusText: "Not Found" }),
    );

    await expect(kaitenRequest("GET", "cards/999")).rejects.toThrow("Kaiten HTTP 404");
  });
});
