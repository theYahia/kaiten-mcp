const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

function getBaseUrl(): string {
  const domain = process.env.KAITEN_DOMAIN;
  if (!domain) throw new Error("KAITEN_DOMAIN не задан");
  return `https://${domain}.kaiten.ru/api/latest`;
}

export async function kaitenRequest(
  method: "GET" | "POST",
  endpoint: string,
  body?: Record<string, unknown>,
  params?: Record<string, string>,
): Promise<unknown> {
  const token = process.env.KAITEN_TOKEN;
  if (!token) throw new Error("KAITEN_TOKEN не задан");

  const baseUrl = getBaseUrl();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    const query = params ? `?${new URLSearchParams(params).toString()}` : "";

    try {
      const response = await fetch(`${baseUrl}/${endpoint}${query}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        return await response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[kaiten-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`Kaiten HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[kaiten-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Kaiten API: все попытки исчерпаны");
}
