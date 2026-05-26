const TIMEOUT_MS = 10000;

function withTimeOut() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

async function throwApiError(
  res: Response,
  method: string,
  endpoint: string,
): Promise<never> {
  let details = res.statusText;
  try {
    const body = await res.text();
    if (body) {
      const json = JSON.parse(body);
      details = json.message ?? json.error ?? body;
    }
  } catch {}
  throw new Error(`[${method} ${endpoint}] ${res.status}: ${details}`, {
    cause: res.status,
  });
}

function resolveUrl(endpoint: string) {
  if (endpoint.startsWith("http")) return endpoint;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return `${base}${endpoint}`;
}

export async function apiGet(endpoint: string) {
  const { signal, clear } = withTimeOut();
  try {
    const res = await fetch(resolveUrl(endpoint), { signal });
    if (!res.ok) await throwApiError(res, "GET", endpoint);
    const text = await res.text();
    return text.trim() ? JSON.parse(text) : null;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Превышено время ожидания");
    }
    throw e;
  } finally {
    clear();
  }
}

export async function apiPost(endpoint: string, payload: unknown) {
  const { signal, clear } = withTimeOut();
  try {
    const res = await fetch(resolveUrl(endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) await throwApiError(res, "POST", endpoint);
    const text = await res.text();
    return text.trim() ? JSON.parse(text) : null;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Превышено время ожидания");
    }
    throw e;
  } finally {
    clear();
  }
}

export async function apiDelete(endpoint: string) {
  const { signal, clear } = withTimeOut();
  try {
    const res = await fetch(resolveUrl(endpoint), { method: "DELETE", signal });
    if (!res.ok) await throwApiError(res, "DELETE", endpoint);
    const text = await res.text();
    return text.trim() ? JSON.parse(text) : null;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Превышено время ожидания");
    }
    throw e;
  } finally {
    clear();
  }
}

export async function apiPatch(endpoint: string, payload?: unknown) {
  const { signal, clear } = withTimeOut();
  try {
    const res = await fetch(resolveUrl(endpoint), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? ""),
      signal,
    });
    if (!res.ok) await throwApiError(res, "PATCH", endpoint);
    const text = await res.text();
    return text.trim() ? JSON.parse(text) : null;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Превышено время ожидания");
    }
    throw e;
  } finally {
    clear();
  }
}
